/* eslint-disable no-console */
// const path = require('path');
// const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/webpack.prod.conf');
const shopify = require('../lib/shopify-deploy');

// // Copy over everything from the 'static' folder
// fs.copySync(path.join(__dirname, '../static'), path.join(__dirname, '../dist'), {
//   dereference: true,
// });

webpack(config, (err, stats) => {
  if (err) throw err;

  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  })}`);

  shopify.overwrite().then(() => {
    console.log(chalk.green('\nFiles overwritten successfully!\n'));
  }).catch((error) => {
    console.log(`\n${chalk.red(error)}\n`);
  });
});
