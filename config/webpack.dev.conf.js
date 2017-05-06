const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.base.conf');
const config = require('./index');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// so that everything is absolute
webpackConfig.output.publicPath = `${config.domain}:${config.port}/`;

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    `webpack-dev-server/client?${webpackConfig.output.publicPath}`,
    'webpack/hot/dev-server',
  ].concat(webpackConfig.entry[name]);
});

module.exports = merge(webpackConfig, {
  devtool: '#eval-source-map',

  devServer: {
    outputPath: 'dist/',
    inline: true,
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
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
      excludeChunks: ['static'],
      filename: '../layout/theme.liquid',
      template: './layout/theme.liquid',
      inject: true,
    }),
  ],
});
