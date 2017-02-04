import {streamSubscribe} from '@cycle/most-adapter'
import HttpServerSource from './HttpServerSource'

export default function makeHttpServerDriver (options = {}) {
  return function httpServerDriver (response$, runSA) {
    return runSA.adapt(new HttpServerSource(response$, options), streamSubscribe)
  }
}
