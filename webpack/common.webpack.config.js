const path = require('path')
const webpack = require('webpack')
const sassImportOnce = require('node-sass-import-once')

const env = process.env.NODE_ENV
const isDeveloppement = env !== 'production'
const outputPath = isDeveloppement ? path.resolve('build') : path.resolve('dist')

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

const plugins = [
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
  new webpack.DefinePlugin({
    ENV: {
      env,
      isDeveloppement
    }
  }),
  isDeveloppement ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin()
]

const commonConfig = {
  devtool: !isDeveloppement ? 'cheap-source-map' : 'cheap-module-eval-source-map',
  entry: {
    common: [
      resolveSourceDir('polyfills.js'),
      resolveSourceDir('shared', 'index.js')
    ]
  },
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

module.exports = {
  commonConfig,
  env,
  isDeveloppement,
  outputPath,
  resolve,
  resolveSourceDir
}
