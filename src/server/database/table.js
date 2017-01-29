import {getDatabaseConnection} from './connection'
import execute from './execute'

export function create (tableName, options = {connection: getDatabaseConnection()}) {
  return execute(r => r.tableCreate(tableName), options)
}

export function drop (tableName, options = {connection: getDatabaseConnection()}) {
  return execute(r => r.tableDrop(tableName), options)
}

export default {
  create,
  drop
}
