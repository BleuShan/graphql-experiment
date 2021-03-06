import r from 'rethinkdb'

const DEFAULT_DATABASE = 'hackathon2017'
const databaseConnections = {}

export function connect (db = DEFAULT_DATABASE, options = {reconnect: false, noreplyWait: true}) {
  if (!getDatabaseConnection(db)) {
    return r.connect({db}).then(connection => {
      databaseConnections[db] = connection
      return connection
    })
  } else if (options.reconnect) {
    return getDatabaseConnection(db).reconnect({noreplyWait: options.noreplyWait})
  }
}

export function getDatabaseConnection (db = DEFAULT_DATABASE) {
  return databaseConnections[db]
}

export function getTable (tableName) {
  return r.table(tableName, {readMode: 'majority'})
}
