import execute from './execute'

export function create (tableName, options = {}) {
  return execute(r => r.tableCreate(tableName), options)
}

export function drop (tableName, options = {}) {
  return execute(r => r.tableDrop(tableName), options)
}
export function list (options = {}) {
  return execute(r => r.tableList(), options)
}

export default {
  create,
  drop,
  list
}
