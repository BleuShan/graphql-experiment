import { makeExecutableSchema } from 'graphql-tools'
import {typeDefs, scalars, types} from './types'

export const api = (resolvers) => makeExecutableSchema({
  typeDefs,
  resolvers: {
    Date: scalars.Date,
    ...resolvers
  }
})

export default {
  schema: {
    api
  },
  scalars,
  types
}
