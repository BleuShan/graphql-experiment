import {fromEvent} from 'most'
import http from 'http'

export function makeHttpServerDriver (config = {port: 3000}, middleware = {}) {
  const port = config.port
  const httpServer = http.createServer()
  httpServer.listen(port)

  return function httpServerDriver (source$) {
    const request$ = fromEvent('request', httpServer).map(([request, response]) => {
      return {
        request,
        response
      }
    })
    return request$
  }
}

export default makeHttpServerDriver
