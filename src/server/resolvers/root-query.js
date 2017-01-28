export const RootQuery = {
  person (obj, args, context) {
    return {
      id: args.id
    }
  }
}

export default RootQuery
