import {run} from '@cycle/most-run'
import {makeHttpServerDriver} from './drivers'
import {createHistory} from 'prehistoric'
import {routerDriver} from '@motorcycle/router'
import main from './main'

const {push, history} = createHistory()

const drivers = {
  HTTP: makeHttpServerDriver(push),
  router: routerDriver
}
const dispose = run(main, drivers)

process.on('SIGTERM', () => {
  dispose()
}).on('SIGINT', () => {
  dispose()
})
