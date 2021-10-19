module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    open: false,
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  publicPath: '/logic-flow/',
  configureWebpack: {
    // webpackConfig.name
    // name: 'logicFlow',
    devtool: 'source-map',
  },
};
