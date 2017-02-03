const {commonConfig, resolveSourceDir, DEBUG} = require('./common.webpack.config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const fs = require('fs')

const TARGET = 'node'
const externals = {}
fs.readdirSync('node_modules').filter((x) => {
  return ['.bin'].indexOf(x) === -1
}).forEach((mod) => {
  externals[mod] = `commonjs ${mod}`
})

const config = {
  entry: {
    app: [
      resolveSourceDir('server', 'index.js')
    ]
  },
  output: {
    filename: DEBUG ? '[name].server.bundle.js' : '[name]-[hash].server.bundle.js',
    chunkFilename: DEBUG ? '[id].server.chunk.js' : '[id]-[hash].server.chunk.js'
  },
  externals,
  plugins: [
    new webpack.DefinePlugin({TARGET})
  ],
  target: TARGET
}

module.exports = DEBUG ? merge({
  entry: {
    common: [
      'webpack/hot/signal'
    ],
    app: [
      'webpack/hot/signal'
    ]
  }
}, commonConfig, config) : merge(commonConfig, config)
