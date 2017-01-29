import {graphql, introspectionQuery} from 'graphql'
import {list, create} from './table'

export function createTablesFromSchema (schema) {
  return list().then(tableList => graphql(schema, introspectionQuery).then(({data}) => {
    const tableNames = data.__schema.types.filter(({kind, name}) => kind === 'OBJECT' && !/^(__|Root)\w+/.test(name))
    .map(({name}) => name).filter(name => tableList.indexOf(name) === -1)

    return Promise.all(tableNames.map(name => create(name)))
  }))
}

export default {
  createTablesFromSchema
}
