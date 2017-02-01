import {fromEvent} from 'most'
import http from 'http'

export function makeHttpServerDriver (config = {port: 3000}, middleware = {}) {
  const port = config.port
  const httpServer = http.createServer()
  httpServer.listen(port)

  return function httpServerDriver () {
    const request$ = fromEvent('request', httpServer)
    return request$
  }
}

export default makeHttpServerDriver
