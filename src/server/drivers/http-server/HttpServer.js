import EventEmitter from 'events'
import Koa from 'koa'
import mount from 'koa-mount'

const DEFAULT_OPTIONS = {port: process.env.PORT || 4000, hostname: 'localhost', logger: console}

class HttpServer extends EventEmitter {
  _sockets = new Set()

  constructor (options = {}) {
    super()
    this._options = {...DEFAULT_OPTIONS, ...options}
  }

  static create = createServer

  get app () {
    if (!this._app) {
      this._app = new Koa()
    }

    return this._app
  }

  get logger () {
    return this._options.logger
  }

  get isActive () {
    return !!this._httpServer
  }

  get options () {
    return this._options
  }

  listen () {
    if (!this._httpServer) {
      const {port, hostname, middleware} = this.options
      this._httpServer = this.app.listen(port, hostname, () => {
        const {address} = this._httpServer.address()
        this.logger.info(`Server ${process.pid} started on ${address}:${port}`)
      })

      this._httpServer.on('connection', (socket) => {
        this._sockets.add(socket)
        this.emit('connection', socket)
        socket.on('close', () => {
          socket.unref()
          this._sockets.delete(socket)
        })
      })

      if (middleware) {
        middleware.forEach(item => {
          if (Reflect.has(item, 'path') && Reflect.has(item, 'handler')) {
            this.mount(item.path, item.handler)
          } else {
            this.mount(item)
          }
        })
      }

      process.on('SIGTERM', () => this.close())
             .on('SIGINT', () => this.close())
             .on('uncaughtException', (error) => {
               this.logger.error(error)
               this.shutdown()
             })
    }

    return this
  }

  shutdown () {
    this._sockets.forEach((socket) => {
      socket.end()

      if (!socket.destroyed) {
        socket.destroy()
      }
    })

    this._sockets.clear()

    this._httpServer.close(() => {
      this.emit('close')
      if (this.closing) {
        clearTimeout(this.closing)
        this.closing = undefined
      }

      this.logger.info(`Server ${process.pid} has terminated`)
      process.exit(0)
    })
  }

  close () {
    if (!this.isActive) {
      return this
    }

    if (this.closing) {
      this.logger.error(`Server ${process.pid} is already shutting down`)
      return
    }

    this.logger.info(`Server ${process.pid} is shutting down`)

    this.closing = setTimeout(() => {
      this.shutdown()
    })
  }

  mount (pathOrHandler, handler) {
    if (!handler) {
      this.app.use(mount(pathOrHandler))
      return this
    }

    this.app.use(mount(pathOrHandler, handler))
    return this
  }

  use (middleware) {
    this.app.use(middleware)
    return this
  }
}

export function createServer (options) {
  return new HttpServer(options)
}

export default HttpServer
