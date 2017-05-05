const path = require('path');
const YAML = require('yamljs');

module.exports = {
  regex: {
    images: /\.(png|svg|jpg|gif)$/,
    static: /\.(liquid|json)$/,
  },

  shopify: YAML.load(path.join(__dirname, 'shopify.yml')),
};
