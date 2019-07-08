const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    nvm: './src/index.js',
  },
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: []
  },
  plugins: [
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      chunks: ['nvm'],
      template: './index.html',
      inject: 'head',
      filename: 'index.html'
    })
  ]
}