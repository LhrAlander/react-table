const { merge } = require('webpack-merge');
const baseCfg = require('./webpack.config');

module.exports = merge(baseCfg, {
  mode: 'development',
  devServer: {
    port: 9000,
    hot: true
  }
})
