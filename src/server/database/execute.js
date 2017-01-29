import r from 'rethinkdb'
import {getDatabaseConnection} from './connection'

function exec (callback, {tableName, connection}) {
  const callbackArg = tableName && (tableName !== ' ' || tableName.length > 0) ? r : r.table(tableName, {readMode: 'majority'})
  return callback(callbackArg).run(connection)
}

export function execute (callback, options = {connection: getDatabaseConnection()}) {
  if (!options.connection) {
    options.connection = getDatabaseConnection()
  }

  return exec(callback, options)
}

export default execute
