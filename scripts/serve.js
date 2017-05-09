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
  contentBase: paths.dist,
  // publicPath: `${webpackConfig.output.publicPath}`,
  noInfo: true,
  reload: false,
  // https: true,
  // headers: {
  //   'Access-Control-Allow-Origin': `https://${config.shopify.development.store}`,
  // },
  stats: {
    colors: true,
    chunks: false,
  },
}));

app.use(webpackHotMiddleware(compiler));

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

  shopify.sync({ upload: files });
  // hotMiddleware.publish({ action: 'reload' });
});


server.listen(config.port);
