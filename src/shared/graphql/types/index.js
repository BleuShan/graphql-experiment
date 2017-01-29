import Api from './api.gql'
import RootQuery from './root-query.gql'
import Entity from './entity.gql'
import Person from './person.gql'
import Date from './date'

export const types = {
  Api,
  Entity,
  Person,
  RootQuery
}

export const scalars = {
  Date
}

export const typeDefs = Object.values(types)
