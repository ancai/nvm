const webpack = require('webpack')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  //see https://github.com/webpack/webpack-dev-server
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 8080
  }
})