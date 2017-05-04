const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../config/webpack.prod.conf');

shell.env.NODE_ENV = 'production';

webpack(config, (err, stats) => {
  if (err) throw err;
  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  })}`);

  // and now upload ?
});
