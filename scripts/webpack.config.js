const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../index.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: ['.jsx', '.ts', '.tsx', '...'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: 'babel-loader'
      }
    ]
  }
}
