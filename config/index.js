import YAML from 'yamljs'
import paths from './paths'

export default {
  paths,
  domain: 'https://localhost',
  port: 8080,
  regex: {
    images: /\.(png|svg|jpg|gif)$/,
    static: /\.(liquid|json)$/
  },
  shopify: YAML.load(paths.userShopifyConfig)
}
