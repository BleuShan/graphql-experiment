import HttpServer from './HttpServer'

export default class HttpServerSource {
  constructor (response$, options) {
    this.server = HttpServer.create(options)
    this._response$ = response$
  }

  static create (response$, options) {
    return new HttpServerSource(response$, options)
  }

  subscribe (observer) {
    this.server.listen().use(async (context, next) => {
      try {
        await next()
      } catch (error) {
        context.status = error.statusCode || error.status || 500
        observer.error(error)
        context.body = {
          message: error.message
        }
      }
    }).use(async (context, next) => {
      this._response$.map((response) => {
        Object.entries(response).forEach(([key, value]) => {
          context.response[key] = value
        })
      }).drain()

      observer.next(context.request)
    })

    this.server.on('close', () => {
      observer.complete()
    })

    return this
  }

  unsubscribe () {
    if (!this.server.closing) {
      this.server.close()
    }
  }
}
