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
      resolveSourceDir('polyfills.js'),
      resolveSourceDir('server', 'index.js')
    ]
  },
  output: {
    filename: DEBUG ? '[name].server.js' : '[name]-[hash].server.js',
    chunkFilename: DEBUG ? '[id].server.chunk.js' : '[id]-[hash].server.chunk.js'
  },
  externals,
  plugins: [
    new webpack.DefinePlugin({TARGET})
  ],
  target: TARGET,
  node: {
    __dirname: false,
    __filename: false
  }
}

module.exports = merge(commonConfig, config)
