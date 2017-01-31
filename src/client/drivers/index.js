import {
  makeDomDriver,
  IsolateModule,
  StyleModule,
  ClassModule,
  PropsModule,
  AttrsModule,
  DatasetModule,
  HeroModule
} from '@motorcycle/dom'
import {makeGraphQLDriver} from 'cycle-graphql-driver'

export const drivers = {
  DOM: makeDomDriver(document.querySelector('#app'), {
    modules: [
      IsolateModule,
      StyleModule,
      ClassModule,
      PropsModule,
      AttrsModule,
      DatasetModule,
      HeroModule
    ]
  })
}

export default drivers