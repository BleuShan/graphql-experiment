import { makeExecutableSchema } from 'graphql-tools'
import {typeDefs, scalars} from './types'

export const api = (resolvers) => makeExecutableSchema({
  typeDefs,
  resolvers: {
    Date: scalars.Date,
    ...resolvers
  }
})
