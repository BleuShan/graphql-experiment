import {run} from '@cycle/most-run'
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
import main from './main'

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

run(main, drivers)
