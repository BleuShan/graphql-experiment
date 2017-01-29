const Path = require('path')
const webpack = require('webpack')
const sassImportOnce = require('node-sass-import-once')
const ReloadServerWebpackPlugin = require('reload-server-webpack-plugin')
const fs = require('fs')

function resolve (...paths) {
  return Path.resolve(__dirname, ...paths)
}
function resolveSourceDir (...paths) {
  return resolve('src', ...paths)
}

const externals = {}
fs.readdirSync('node_modules').filter((x) => {
  return ['.bin'].indexOf(x) === -1
}).forEach((mod) => {
  externals[mod] = `commonjs ${mod}`
})

const env = process.env.NODE_ENV
const isTest = env === 'test'
const isDeveloppement = isTest || env !== 'prod' || env !== 'production'
const outputPath = isDeveloppement ? resolve('build') : resolve('dist')

const entries = {
  server: [
    resolveSourceDir('server', 'index.js')
  ]
}

let plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    sourceMap: isDeveloppement
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: isDeveloppement
  }),
  new webpack.optimize.CommonsChunkPlugin({
    children: true,
    async: true,
    minChunks: 2
  })
]

if (isDeveloppement) {
  plugins = [
    ...plugins,
    new webpack.NamedModulesPlugin(),
    new ReloadServerWebpackPlugin({
      script: resolve('build', 'server.js')
    })
  ]
} else {
  plugins = [
    ...plugins,
    new webpack.HashedModuleIdsPlugin()
  ]
}

const config = {
  devtool: !isDeveloppement ? 'cheap-source-map' : 'cheap-module-eval-source-map',
  entry: entries,
  target: 'node',
  output: {
    path: outputPath,
    filename: isDeveloppement ? '[name].js' : '[name]-[hash].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },
  externals,
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /((?!queries?).*)\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /((queries?).*)\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'graphql-tag/loader'
          }
        ]
      },
      {
        test: /\.((s(c|a))|c)ss$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: isDeveloppement,
              localIdentName: '[name]-[local][hash:base64:5]',
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: isDeveloppement ? 'compact' : 'compressed',
              importer: sassImportOnce,
              importOnce: {
                index: true,
                css: true,
                bower: false
              }
            }
          }
        ]
      },
      {
        test: /((fonts?).*)\.(eot|ttf|woff|woff2|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDeveloppement ? 'fonts/[name].[ext]' : 'fonts/[name][hash].[ext]'
            }
          }
        ]
      },
      {
        test: /^((?!fonts?).*)\.(gif|png|jpe?g|ico|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: isDeveloppement ? 'images/[name].[ext]' : 'images/[name][hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optimizationLevel: 7,
              progressive: true,
              interlaced: true
            }
          }
        ]
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: [
      ' ',
      '.js',
      '.css', '.scss', 'sass',
      '.html', '.ejs',
      '.json'
    ]
  }
}

module.exports = config
