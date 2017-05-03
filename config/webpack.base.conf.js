var path = require('path')

module.exports = {
  entry: [
    './src/assets/js/index.js'
  ],

  output: {
    filename: 'theme.js',
    path: path.resolve(__dirname, '../dist/assets')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7']
              },
              modules: false
            }]
          ]
        }
      }
    ]
  }
}
