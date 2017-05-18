const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

function resolveSelf(relativePath) {
  return path.resolve(__dirname, '../', relativePath)
}

module.exports = {
  root: appDirectory,
  dist: resolveApp('dist'),
  static: resolveApp('static'),
  src: resolveApp('src'),
  lib: resolveSelf('lib'),
  entrypoints: {
    scripts: resolveApp('src/assets/js/index.js'),
    static: resolveSelf('lib/static-files-glob.js')
  },
  assetsOutput: resolveApp('dist/assets'),
  userShopifyConfig: resolveApp('shopify.yml'),
  eslintrc: resolveSelf('./.eslintrc')
}
