const {commonConfig, resolve, DEBUG} = require('./common.webpack.config')
const merge = require('webpack-merge')
const ReloadServerWebpackPlugin = require('reload-server-webpack-plugin')
const fs = require('fs')

const externals = {}
fs.readdirSync('node_modules').filter((x) => {
  return ['.bin'].indexOf(x) === -1
}).forEach((mod) => {
  externals[mod] = `commonjs ${mod}`
})

const config = {
  target: 'node',
  externals
}

module.exports = DEBUG ? merge({
  plugins: [
    new ReloadServerWebpackPlugin({
      script: resolve(DEBUG ? 'build' : 'dist', 'app.js')
    })
  ]
}, commonConfig, config) : merge(commonConfig, config)
