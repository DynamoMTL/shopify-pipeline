const path = require('path');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const regex = {
  images: /\.(png|svg|jpg|gif)$/,
  markup: /\.(liquid)$/,
};

module.exports = {
  context: path.join(__dirname, '../src'),

  entry: {
    scripts: './assets/js/index.js',
    liquid: '../scripts/liquid-files-glob.js',
  },

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist/assets'),
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
        test: regex.images,
        exclude: /node_modules/,
        loader: ['file-loader', 'img-loader'],
      },
      {
        test: regex.markup,
        exclude: /(node_modules|layout\/theme\.liquid)/,
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      },
    ],
  },

  plugins: [
    new WriteFileWebpackPlugin({
      test: regex.images,
      useHashIndex: true,
      log: false,
    }),

    new WriteFileWebpackPlugin({
      test: regex.markup,
      useHashIndex: true,
      log: false,
    }),
  ],
};
