import {run} from '@cycle/most-run'
import {makeHttpServerDriver} from './drivers'
import main from './main'

const drivers = {
  HTTP: makeHttpServerDriver()
}

run(main, drivers)
