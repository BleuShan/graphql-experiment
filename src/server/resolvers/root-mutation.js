import r from 'rethinkdb'

export const RootMutation = {
  createPerson (parent, input, {database}) {
    return database.execute((table) => {
      return table.insert({
        ...input,
        createdAt: r.now(),
        modifiedAt: r.now()
      })
    }, {tableName: 'Person'})
  }
}

export default RootMutation
