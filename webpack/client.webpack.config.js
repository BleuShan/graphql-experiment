const {commonConfig, isDeveloppement, resolveSourceDir} = require('./common.webpack.config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ResourceHintsWebpackPlugin = require('resource-hints-webpack-plugin')

const config = {
  entry: {
    client: [
      resolveSourceDir('main.js')
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'graphql-experiment',
      template: `.${resolveSourceDir('client', 'index.ejs')}`,
      favicon: `.${resolveSourceDir('client', 'index.ejs')}`,
      showErrors: isDeveloppement
    }),
    new ResourceHintsWebpackPlugin(),
    new webpack.IgnorePlugin(/(rx|rxjs|xstream)-adapter/)
  ]
}

module.exports = isDeveloppement ? merge({
  entry: {
    common: [
      'webpack-hot-middleware/client'
    ],
    client: [
      'webpack-hot-middleware/client'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}, commonConfig, config) : merge(commonConfig, config)
