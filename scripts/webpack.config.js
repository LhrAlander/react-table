const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/template.html')
    })
  ],
  resolve: {
    extensions: ['.jsx', '.ts', '.tsx', '...'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.*\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:6]',
                exportLocalsConvention: 'camelCase'
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          'less-loader',
        ]
      }
    ]
  }
}
