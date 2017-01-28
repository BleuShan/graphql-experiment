const Path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFileWebPackPlugin = require('write-file-webpack-plugin')
const ResourceHintsWebpackPlugin = require('resource-hints-webpack-plugin')
const sassImportOnce = require('node-sass-import-once')

function resolve (...paths) {
  return Path.resolve(process.cwd(), ...paths)
}
function resolveSourceDir (...paths) {
  return resolve('src', ...paths)
}

const env = process.env.NODE_ENV
const isTest = env === 'test'
const isDeveloppement = isTest || env !== 'prod' || env !== 'production'
const outputPath = isDeveloppement ? resolve('build') : resolve('dist')
const port = process.env.PORT || 3000

const entries = {
  commons: [
    resolveSourceDir('polyfills.js'),
    resolveSourceDir('shared', 'index.js')
  ],
  client: [
    resolveSourceDir('client', 'index.js')
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
  }),
  new HtmlWebpackPlugin({
    title: 'Hackathon 2017',
    template: resolveSourceDir('client', 'index.ejs'),
    favicon: resolveSourceDir('client', 'favicon.ico'),
    showErrors: isDeveloppement
  }),
  new ResourceHintsWebpackPlugin(),
  new WriteFileWebPackPlugin({
    test: /^((?!hot-update).)*$/
  })
]

if (isDeveloppement) {
  entries.commons = [
    'webpack-hot-middleware/client',
    ...entries.commons
  ]
  plugins = [
    ...plugins,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
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
  output: {
    path: outputPath,
    filename: isDeveloppement ? '[name].js' : '[name]-[hash].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },
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
        test: /\.(graphql|gql)$/,
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
