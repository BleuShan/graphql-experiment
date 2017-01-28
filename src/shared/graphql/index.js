import { makeExecutableSchema } from 'graphql-tools'
import {typeDefs} from './types'

export const api = (resolvers) => makeExecutableSchema({
  typeDefs,
  resolvers
})
