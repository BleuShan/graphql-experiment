import r from 'rethinkdb'
import {getDatabaseConnection, getTable} from './connection'

function exec (callback, options) {
  const tableName = options.tableName
  const connection = options.connection
  const callbackArg = tableName && (tableName !== ' ' || tableName.length > 0) ? getTable(tableName) : r
  return callback(callbackArg).run(connection, {readMode: 'majority', durability: 'hard'})
}

export function execute (callback, options = {}) {
  if (!options.connection) {
    options.connection = getDatabaseConnection()
  }

  return exec(callback, options)
}

export default execute
