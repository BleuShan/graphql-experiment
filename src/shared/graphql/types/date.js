import {GraphQLScalarType} from 'graphql'
import moment from 'moment'

export const GraphQLDateType = new GraphQLScalarType({
  name: 'Date',
  description: 'represents a date',
  parseValue (value) {
    return moment(value)
  },
  parseLiteral (ast) {
    return moment(ast.value)
  },
  serialize (value) {
    return value.getTime()
  }
})

export default GraphQLDateType
