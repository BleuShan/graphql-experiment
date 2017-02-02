import http from 'http'
import express from 'express'

export function makeHttpServerDriver (options = {}) {
  let {port, middleware} = options
  const app = express()
  const server = http.createServer(app)

  if (middleware) {
    middleware.forEach((item) => {
      app.use(item)
    })
  }

  if (!port) {
    port = process.env.PORT || 3000
  }

  if (DEBUG) {
    server.on('listening', () => {
      console.log(`server started on [${server.address().address}]:${port}`)
    })
  }

  server.listen(port)

  return function serverDriver (sink$, streamAdapter) {
    const {stream} = streamAdapter.makeSubject()
    app.get('/', (request, response) => {
      streamAdapter.streamSubscribe(sink$, {
        next ({status, body}) {
          if (status) {
            response.status(status)
          }

          response.send(body)
        }
      })
      stream.next(request)
    })

    process.on('exit', () => {
      stream.complete(() => {
        console.log('server terminated')
        return process.exitCode
      })
    })

    return streamAdapter.remember(stream)
  }
}

export default makeHttpServerDriver
