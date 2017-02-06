import mostAdapter from '@cycle/most-adapter'
import HttpServer from './HttpServer'
import {async, hold} from 'most-subject'

export default function makeHttpServerDriver (push, options) {
  return function httpServerDriver (response$, runSA) {
    const source = hold(1, async())
    const server = new HttpServer()
    console.log(source)

    server.listen().use(async (context, next) => {
      await next()
      response$.observe((response) => {
        Object.entries(response).forEach(([key, value]) => {
          context[key] = value
        })
      })
      source.next(context)
      push(context.path)
    })

    return runSA.adapt(source, mostAdapter.streamSubscribe)
  }
}
