const argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const express = require('express')
const fs = require('fs')
const path = require('path')
const https = require('https')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const openBrowser = require('react-dev-utils/openBrowser')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const config = require('../config')
const paths = require('../config/paths')
const webpackConfig = require('../config/webpack.dev.conf')
const shopify = require('../lib/shopify-deploy')
const env = require('../lib/getShopifyEnvOrDie.js')(argv.env, config.shopify)

const fakeCert = fs.readFileSync(path.join(__dirname, '../ssl/server.pem'))
const sslOptions = {
  key: fakeCert,
  cert: fakeCert
}

const app = express()
const server = https.createServer(sslOptions, app)
const compiler = webpack(webpackConfig)

const shopifyUrl = `https://${config.shopify.development.store}`
const previewUrl = `${shopifyUrl}?preview_theme_id=${config.shopify.development.theme_id}`

let isFirstCompilation = true

function getFilesFromAssets(assets) {
  let files = []

  Object.keys(assets).forEach((key) => {
    const asset = assets[key]

    if (asset.emitted) {
      // webpack-dev-server doesn't write assets to disk, see webpack.base.conf.js
      // where we use WriteFileWebpackPlugin to write certain assets to disk
      // (the ones to be uploaded) (the others are served from memory)
      if (fs.existsSync(asset.existsAt)) {
        files = [...files, asset.existsAt.replace(paths.dist, '')]
      }
    }
  })

  return files
}

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', shopifyUrl)
  next()
})

app.use(webpackDevMiddleware(compiler, {
  quiet: true,
  reload: false
}))

const hotMiddleware = webpackHotMiddleware(compiler)
app.use(hotMiddleware)

compiler.plugin('invalid', () => {
  clearConsole()
  console.log('Compiling...')
})

compiler.plugin('done', (stats) => {
  clearConsole()

  // webpack messages massaging and logging gracioulsy provided by create-react-app.
  const messages = formatWebpackMessages(stats.toJson({}, true))

  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log(chalk.red('Failed to compile.\n'))
    messages.errors.forEach((message) => {
      console.log(`${message}\n`)
    })
    return
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    messages.warnings.forEach((message) => {
      console.log(`${message}\n`)
    })
    // Teach some ESLint tricks.
    console.log('You may use special comments to disable some warnings.')
    console.log(`Use ${chalk.yellow('// eslint-disable-next-line')} to ignore the next line.`)
    console.log(`Use ${chalk.yellow('/* eslint-disable */')} to ignore all warnings in a file.`)
  }

  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green('Compiled successfully!'))
    console.log('\nThe app is running at:\n')
    console.log(`  ${chalk.cyan(previewUrl)}`)
  }

  const files = getFilesFromAssets(stats.compilation.assets)

  console.log(chalk.cyan('\nUploading files to Shopify...\n'))
  files.forEach((file) => {
    console.log(`  ${file}`)
  })
  console.log('\n')

  shopify.sync(env, { upload: files }).then(() => {
    console.log(chalk.green('\nFiles uploaded successfully!\n'))

    if (isFirstCompilation) {
      isFirstCompilation = false
      openBrowser(previewUrl)
    }

    hotMiddleware.publish({
      action: 'shopify_upload_finished',
      force: files.length === 1 && files[0] === '/layout/theme.liquid'
    })
  }).catch((err) => {
    console.log(chalk.red(err))
  })
})

server.listen(config.port)
