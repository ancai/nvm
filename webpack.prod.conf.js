const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config')
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    publicPath: 'https://static.ws.126.net/163/f2e/m-sdk'
  },
  plugins: [
    new CleanWebpackPlugin(['./dist'])
  ]
})