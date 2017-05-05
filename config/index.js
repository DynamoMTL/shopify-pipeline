const path = require('path');
const YAML = require('yamljs');

module.exports = {
  domain: 'https://localhost',
  port: 8080,

  regex: {
    images: /\.(png|svg|jpg|gif)$/,
    static: /\.(liquid|json)$/,
  },

  shopify: YAML.load(path.join(__dirname, 'shopify.yml')),
};
