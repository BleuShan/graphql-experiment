import Api from './api.gql'
import RootQuery from './root-query.gql'
import RootMutation from './root-mutation.gql'
import Entity from './entity.gql'
import Person from './person.gql'
import PersonInput from './person-input.gql'
import Date from './date'

export const types = {
  Api,
  Entity,
  Person,
  PersonInput,
  RootQuery,
  RootMutation
}

export const scalars = {
  Date
}

export const typeDefs = Object.values(types)
