const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.base.conf');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// so that everything is absolute
config.output.publicPath = 'http://localhost:8080/';

// add hot-reload related code to entry chunks
Object.keys(config.entry).forEach((name) => {
  config.entry[name] = [
    `webpack-dev-server/client?${config.output.publicPath}`,
    'webpack/hot/dev-server',
  ].concat(config.entry[name]);
});

module.exports = merge(config, {
  devtool: '#eval-source-map',

  devServer: {
    outputPath: 'dist/',
    inline: true,
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' },
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      excludeChunks: ['liquid'],
      filename: '../layout/theme.liquid',
      // filename: 'index.html',
      template: './layout/theme.liquid',
      inject: true,
    }),
  ],
});
