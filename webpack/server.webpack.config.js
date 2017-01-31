const {commonConfig, resolve, resolveSourceDir, isDeveloppement} = require('./common.webpack.config')
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
  entry: {
    server: [
      resolveSourceDir('server', 'index.js')
    ]
  },
  externals
}

module.exports = isDeveloppement ? merge({
  plugins: [
    new ReloadServerWebpackPlugin({
      script: resolve('build', 'server.js')
    })
  ]
}, commonConfig, config) : merge(commonConfig, config)
