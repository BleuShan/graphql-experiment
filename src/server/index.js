import express from 'express'
import graphqlHTTP from 'express-graphql'
import {api} from '../shared/graphql'
import resolvers from './resolvers'

const env = process.env.NODE_ENV
const isTest = env === 'test'
const isDeveloppement = isTest || env !== 'prod' || env !== 'production'
const port = process.env.PORT || 3000

const server = express()

server.use('/api', graphqlHTTP({
  schema: api(resolvers),
  graphiql: isDeveloppement
}))

if (isDeveloppement) {
  const webpackConfig = require('../client/webpack.config.js')
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(webpackConfig)
  server.use(webpackDevMiddleware(compiler, {
    stats: {
      colors: true
    },
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    }
  }))
  server.use(webpackHotMiddleware(compiler, {
    reload: true
  }))
}

server.listen(port)
