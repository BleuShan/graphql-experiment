export const RootQuery = {
  person (parentValue, {id}, {database}) {
    return database.query(table => {
      return table.get(id)
    }, {tableName: 'persons'})
  }
}

export default RootQuery
