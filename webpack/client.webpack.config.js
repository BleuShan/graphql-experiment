const {commonConfig, DEBUG, resolveSourceDir} = require('./common.webpack.config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ResourceHintsWebpackPlugin = require('resource-hints-webpack-plugin')

const TARGET = 'web'

const config = {
  entry: {
    common: [
      'whatwg-fetch'
    ],
    app: [
      resolveSourceDir('client', 'index.js')
    ]
  },
  output: {
    filename: DEBUG ? '[name].client.bundle.js' : '[name]-[hash].client.bundle.js',
    chunkFilename: DEBUG ? '[id].client.chunk.js' : '[id]-[hash].client.chunk.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'graphql-experiment',
      template: resolveSourceDir('client', 'index.ejs'),
      favicon: resolveSourceDir('client', 'favicon.ico'),
      showErrors: DEBUG
    }),
    new ResourceHintsWebpackPlugin(),
    new webpack.DefinePlugin({
      TARGET
    })
  ],
  target: TARGET
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
    new webpack.IgnorePlugin(/(rx|rxjs|xstream)-adapter/)()
  ]
}, commonConfig, config) : merge(commonConfig, config)
