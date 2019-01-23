const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    mvvm: './src/index.js',
  },
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname ,'src'), path.resolve(__dirname ,'test')]
      }
    ]
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      chunks: ['mvvm'],
      template: './index.html',
      inject: 'head',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['mvvm'],
      template: './test.html',
      inject: 'head',
      filename: 'test.html'
    })
  ]
}