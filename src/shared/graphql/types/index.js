import Account from './account.gql'
import Api from './api.gql'
import RootQuery from './root-query.gql'
import RootMutation from './root-mutation.gql'
import Entity from './entity.gql'
import Person from './person.gql'
import Date from './date'

export const types = {
  Account,
  Api,
  Entity,
  Person,
  RootQuery,
  RootMutation
}

export const scalars = {
  Date
}

export const typeDefs = Object.values(types)
