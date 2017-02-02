const {commonConfig, DEBUG, resolveSourceDir} = require('./common.webpack.config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ResourceHintsWebpackPlugin = require('resource-hints-webpack-plugin')

const config = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'graphql-experiment',
      template: resolveSourceDir('client', 'index.ejs'),
      favicon: resolveSourceDir('client', 'index.ejs'),
      showErrors: DEBUG
    }),
    new ResourceHintsWebpackPlugin(),
    new webpack.IgnorePlugin(/(rx|rxjs|xstream)-adapter/)
  ]
}

module.exports = DEBUG ? merge({
  entry: {
    common: [
      'webpack-hot-middleware/client'
    ],
    app: [
      'webpack-hot-middleware/client'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}, commonConfig, config) : merge(commonConfig, config)
