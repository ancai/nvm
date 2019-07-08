const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config')
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    publicPath: ''
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
})