import {graphql, introspectionQuery} from 'graphql'
import {list, create} from './table'

function shouldCreateTable ({kind, name}, tableList) {
  return tableList.indexOf(name) === -1 && kind === 'OBJECT' && !/^(__|Root)\w+(Input)?$/.test(name)
}

export function createTablesFromSchema (schema) {
  return list().then(tableList => graphql(schema, introspectionQuery).then(({data}) => {
    const createdTables = data.__schema.types.filter(type => shouldCreateTable(type, tableList))
    .map(({name}) => create(name))

    return Promise.all(createdTables)
  }))
}

export default {
  createTablesFromSchema
}
