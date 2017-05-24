import chalk from 'chalk'
import minimist from 'minimist'
import webpack from 'webpack'
import webpackConfig from '../config/webpack.prod.conf'
import config from '../config'
import shopify from '../lib/shopify-deploy'
import getShopifyEnvOrDie from '../lib/getShopifyEnvOrDie'

const argv = minimist(process.argv.slice(2))
const env = getShopifyEnvOrDie(argv.env, config.shopify)

webpack(webpackConfig, (err, stats) => {
  if (err) throw err

  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  })}`)

  if (argv.deploy) {
    shopify.overwrite(env).then(() => {
      console.log(chalk.green('\nFiles overwritten successfully!\n'))
    }).catch((error) => {
      console.log(`\n${chalk.red(error)}\n`)
    })
  }
})
