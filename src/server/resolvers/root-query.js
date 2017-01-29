export const RootQuery = {
  account (parentValue, {id, ownerId}, {database}) {
    return database.execute((table) => table.get(id), {tableName: 'Account'})
  },
  accountByOwner (parentValue, {ownerId}, {database}) {
    return database.execute((table) => table.filter(value => value('ownerId').eq(ownerId)), {tableName: 'Account'})
  },
  person (parentValue, {id}, {database}) {
    return database.execute((table) => table.get(id), {tableName: 'Person'})
  },
  persons (parentValue, args, {database}) {
    return database.execute((table) => table, {tableName: 'Person'})
    .then(result => result.toArray())
  }
}

export default RootQuery
