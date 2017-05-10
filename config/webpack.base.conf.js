const webpack = require('webpack');
const config = require('../config');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const SvgStore = require('webpack-svgstore-plugin');
const paths = require('../config/paths');

module.exports = {
  context: paths.src,

  entry: paths.entrypoints,

  output: {
    filename: '[name].[hash].js',
    path: paths.assetsOutput,
  },

  resolveLoader: {
    modules: ['node_modules', 'scripts/loaders'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: paths.eslintrc,
        },
      },
      // {
      //   enforce: 'pre',
      //   test: /\.liquid$/,
      //   exclude: /node_modules/,
      //   include: /templates/,
      //   loader: 'liquidlint-loader',
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7'],
              },
              modules: false,
            }],
          ],
        },
      },
      {
        test: config.regex.images,
        exclude: /node_modules/,
        loader: ['file-loader', 'img-loader'],
      },
      {
        test: config.regex.static,
        exclude: /(node_modules|layout\/theme\.liquid)/,
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /allstaticfiles/,
      paths.src,
      true,
      // eslint-disable-next-line
      /^(?:(?!theme\.liquid$).)*\.(liquid|json)$/
    ),

    new WriteFileWebpackPlugin({
      test: config.regex.images,
      useHashIndex: true,
      log: false,
    }),

    new WriteFileWebpackPlugin({
      // test: config.regex.static,
      test: /^(?:(?!hot-update.json$).)*\.(liquid|json)$/,
      useHashIndex: true,
      log: false,
    }),

    new SvgStore({
      svgoOptions: {
        plugins: [
          { removeTitle: true },
        ],
      },
      prefix: 'icon',
    }),
  ],
};
