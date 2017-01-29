import {run} from '@cycle/most-run'
import {makeDomDriver} from '@motorcycle/dom'
import App from './app'

const drivers = {
  DOM: makeDomDriver(document.querySelector('#app'))
}

run(App, drivers)
