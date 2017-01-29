export const RootQuery = {
  person (parentValue, {id}, {database}) {
    return database.execute((table) => table.get(id), {tableName: 'Person'})
  }
}

export default RootQuery
