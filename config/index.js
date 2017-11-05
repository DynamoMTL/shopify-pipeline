const fs = require('fs')
const paths = require('./paths')
const YAML = require('yamljs')
const merge = require('merge')

let config = {
  paths,
  domain: 'https://localhost',
  port: 8080,
  serveHttps: true,
  regex: {
    images: /\.(png|svg|jpg|gif)$/,
    static: /\.(liquid|json)$/
  }
}

if(fs.existsSync(paths.userServerConfig)) {
  config = merge(true, config, YAML.load(paths.userServerConfig))
}

config.devDomain = config.devDomain || `${config.domain}:${config.port}`

config.shopify = YAML.load(paths.userShopifyConfig)

module.exports = config
