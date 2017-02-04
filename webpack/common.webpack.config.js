const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const sassImportOnce = require('node-sass-import-once')

const ENV = process.env.NODE_ENV
const DEBUG = ENV !== 'production'
const outputPath = DEBUG ? path.resolve('build') : path.resolve('dist')
const publicPath = path.join(outputPath, 'public')

function resolve (...paths) {
  const cwd = process.cwd()

  if (cwd === '/') {
    return path.join('.', ...paths)
  }

  return path.resolve(cwd, ...paths)
}

function resolveSourceDir (...paths) {
  return resolve('src', ...paths)
}

const styleLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: DEBUG,
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
      outputStyle: DEBUG ? 'compact' : 'compressed',
      importer: sassImportOnce,
      importOnce: {
        index: true,
        css: true,
        bower: false
      }
    }
  }
]

const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    sourceMap: DEBUG
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: DEBUG
  }),
  new webpack.optimize.CommonsChunkPlugin({
    children: true,
    async: true,
    minChunks: 2
  }),
  new webpack.DefinePlugin({
    ENV,
    DEBUG
  }),
  DEBUG ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin()
]

let commonConfig = {
  devtool: !DEBUG ? 'cheap-module-source-map' : 'cheap-eval-module-source-map',
  entry: {
    common: [
      resolveSourceDir('polyfills.js'),
      resolveSourceDir('shared', 'index.js')
    ]
  },
  output: {
    path: outputPath,
    publicPath: publicPath
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
        use: DEBUG ? [
          {
            loader: 'style-loader'
          },
          ...styleLoaders
        ] : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: styleLoaders
        })
      },
      {
        test: /((fonts?).*)\.(eot|ttf|woff|woff2|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: DEBUG ? 'fonts/[name].[ext]' : 'fonts/[name][hash].[ext]'
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
              name: DEBUG ? 'images/[name].[ext]' : 'images/[name][hash].[ext]'
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
  recordsPath: resolve('webpack', 'records.json'),
  resolve: {
    extensions: [
      ' ',
      '.js',
      '.css', '.scss', 'sass',
      '.html',
      '.json'
    ]
  }
}

if (!DEBUG) {
  commonConfig = merge(commonConfig, {
    plugins: [
      new ExtractTextPlugin('styles.css')
    ]
  })
}

module.exports = {
  commonConfig,
  ENV,
  DEBUG,
  outputPath,
  publicPath,
  resolve,
  resolveSourceDir
}
