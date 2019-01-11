const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    tie: './src/main.js',
    tie_ie: ['babel-polyfill', 'whatwg-fetch', './src/main.js']
  },
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname ,'src')]
      }
    ]
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      chunks: ['tie'],
      template: './index.html',
      inject: 'head',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['tie_ie'],
      template: './ie.html',
      inject: 'head',
      filename: 'ie.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['tie'],
      template: './multi.html',
      inject: 'head',
      filename: 'multi.html'
    })
  ]
}