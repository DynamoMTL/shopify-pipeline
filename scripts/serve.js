const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config');
const paths = require('../config/paths');
const webpackConfig = require('../config/webpack.dev.conf');
const shopify = require('../lib/shopify-deploy');

const fakeCert = fs.readFileSync(path.join(__dirname, '../ssl/server.pem'));
const sslOptions = {
  key: fakeCert,
  cert: fakeCert,
};

const app = express();
const server = https.createServer(sslOptions, app);
const compiler = webpack(webpackConfig);

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', `https://${config.shopify.development.store}`);
  next();
});

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  reload: false,
}));

const hotMiddleware = webpackHotMiddleware(compiler);
app.use(hotMiddleware);

compiler.plugin('done', (stats) => {
  let files = [];

  Object.keys(stats.compilation.assets).forEach((key) => {
    const asset = stats.compilation.assets[key];

    if (asset.emitted) {
      // webpack-dev-server doesn't write assets to disk, see webpack.base.conf.js
      // where we use WriteFileWebpackPlugin to write certain assets to disk
      // (the ones to be uploaded) (the others are served from memory)
      if (fs.existsSync(asset.existsAt)) {
        files = [...files, asset.existsAt.replace(paths.dist, '')];
      }
    }
  });

  shopify.sync({ upload: files }).then(() => {
    // Do not warn about updating theme.liquid, it's also updated when styles
    // and scripts are updated.
    if (files.length === 1 && files[0] === '/layout/theme.liquid') {
      return;
    }

    hotMiddleware.publish({ action: 'shopify_upload_finished' });
  // eslint-disable-next-line
  }).catch((err) => console.log(err || 'Could not deploy to Shopify.'));
});

server.listen(config.port);
