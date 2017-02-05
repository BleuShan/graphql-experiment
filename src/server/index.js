import {run} from '@cycle/most-run'
import {makeHttpServerDriver} from './drivers'
import main from './main'

const drivers = {
  HTTP: makeHttpServerDriver()
}
const dispose = run(main, drivers)

process.on('SIGTERM', () => {
  dispose()
}).on('SIGINT', () => {
  dispose()
})
