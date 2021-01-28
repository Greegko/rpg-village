const webpackConfig = require('./webpack.config.js');

module.exports = Object.assign(webpackConfig, {
  mode: 'development',
  devtool: "cheap-module-source-map",

  devServer: {
    historyApiFallback: true,
    stats: "minimal"
  }
});
