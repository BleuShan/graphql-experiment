import mostAdapter from '@cycle/most-adapter'
import HttpServerSource from './HttpServerSource'

export default function makeServerDriver (options) {
  return function serverDriver (response$, runSA) {
    const source = runSA.adapt(HttpServerSource.create(response$, options), mostAdapter.streamSubscribe)
    return runSA.remember(source)
  }
}
