import r from 'rethinkdb'
import {invariant, isNullish} from 'graphql'

export const RootMutation = {
  createPerson (parent, {person}, {database}) {
    return database.execute((table) => {
      return table.insert({
        ...person,
        createdAt: r.now(),
        modifiedAt: r.now()
      }, {returnChanges: true, durability: 'hard'})
    }, {tableName: 'Person'}).then(({changes}) => changes[0].new_val)
  },
  updatePerson (parent, {person}, {database}) {
    invariant(!isNullish(person.id), 'person.id must not be nullish')
    return database.execute((table) => {
      return table.get(person.id).update({
        ...person,
        modifiedAt: r.now()
      }, {returnChanges: true, durability: 'hard'})
    }, {tableName: 'Person'}).then(({changes}) => changes[0].new_val)
  },
  createAccount (parent, {account}, {database}) {
    return database.execute((table) => {
      return table.insert({
        ...account,
        createdAt: r.now(),
        modifiedAt: r.now()
      }, {returnChanges: true, durability: 'hard'})
    }, {tableName: 'Account'}).then(({changes}) => changes[0].new_val)
  },
  updateAccount (parent, {account}, {database}) {
    invariant(!isNullish(account.id), 'account.id must not be nullish')
    return database.execute((table) => {
      return table.get(account.id).update({
        ...account,
        modifiedAt: r.now()
      }, {returnChanges: true, durability: 'hard'})
    }, {tableName: 'Account'}).then(({changes}) => changes[0].new_val)
  }
}

export default RootMutation
