import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import config from './index'
import webpackConfig from './webpack.base.conf'
import getUserWebpackConfig from '../lib/getUserWebpackConfig'

const userWebpackConfig = getUserWebpackConfig('dev')

// so that everything is absolute
webpackConfig.output.publicPath = `${config.domain}:${config.port}/`

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    path.join(__dirname, '../lib/hot-client.js')
  ].concat(webpackConfig.entry[name])
})

export default merge(webpackConfig, {
  devtool: '#eval-source-map',

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' }
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      excludeChunks: ['static'],
      filename: '../layout/theme.liquid',
      template: './layout/theme.liquid',
      inject: true
    })
  ]
}, userWebpackConfig)
