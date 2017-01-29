import '../polyfills'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import {api} from '../shared/graphql'
import resolvers from './resolvers'
import database from './database'

const env = process.env.NODE_ENV
const isTest = env === 'test'
const isDeveloppement = isTest || env !== 'prod' || env !== 'production'
const port = process.env.PORT || 3000
const schema = api(resolvers)

database.connect('hackathon2017').then(connection => {
  connection.server().then((serverInfo) => {
    console.log('connected to database server:', JSON.stringify(serverInfo.name))
  })

  const server = express()

  if (isDeveloppement) {
    const webpackConfig = require('../client/webpack.config.js')
    webpackConfig.output.path = '/'
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const compiler = webpack(webpackConfig)
    server.use(webpackDevMiddleware(compiler, {
      lazy: false,
      noInfo: true,
      stats: {
        colors: true
      },
      publicPath: webpackConfig.output.publicPath
    }))
    server.use(webpackHotMiddleware(compiler))
  }
  database.createTablesFromSchema(schema).then(() => {
    server.use('/api', graphqlHTTP({
      schema,
      graphiql: isDeveloppement,
      context: {
        database
      }
    }))

    server.listen(port)
  })
}).catch((error) => {
  console.error('database connection', error)
})
