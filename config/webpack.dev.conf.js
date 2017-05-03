var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./webpack.base.conf.js')

// // add hmr
// Object.keys(config.entry).forEach((name) => {
//   config.entry[name] = ['./app/build/dev-client'].concat(config.entry[name]);
// })

module.exports = merge(config, {
  devtool: '#eval-source-map'
})
