import express from 'express'
import graphqlHTTP from 'express-graphql'

const server = express()

server.use('/api', graphqlHTTP({

}))
