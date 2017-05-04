const shell = require('shelljs');
// const path = require('path')

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../config/webpack.dev.conf');

shell.env.NODE_ENV = 'development';

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: 'dist/',
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

compiler.plugin('done', (stats) => {
  // eslint-disable-next-line
  console.log(Object.keys(stats.compilation.assets));
  // Here we could upload modified files to Shopify...
});

server.listen(8080);
