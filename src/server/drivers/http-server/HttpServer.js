import EventEmitter from 'events'
import Koa from 'koa'

const DEFAULT_OPTIONS = {port: process.env.PORT || 4000, hostname: 'localhost', logger: console}

export default class HttpServer extends EventEmitter {
  _sockets = new Set()

  constructor (options = {}) {
    super()
    this._options = {...DEFAULT_OPTIONS, ...options}
  }

  static create (options) {
    return new HttpServer(options)
  }

  get app () {
    if (!this._app) {
      this._app = new Koa()
    }

    return this._app
  }

  get logger () {
    return this._options.logger
  }

  get options () {
    return this._options
  }

  listen () {
    if (!this._httpServer) {
      const {port, hostname} = this.options
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

      process.on('SIGTERM', () => {
        this.close()
      }).on('SIGINT', () => {
        this.close()
      })
    }

    return this
  }

  close () {
    if (this.closing) {
      this.logger.error(`Server ${process.pid} is already shutting down`)
      return
    }

    if (!this._httpServer) {
      return this
    }

    this.logger.info(`Server ${process.pid} is shutting down`)
    this.emit('close')

    this.closing = setTimeout(() => {
      this._sockets.forEach((socket) => {
        socket.end()

        if (!socket.destroyed) {
          socket.destroy()
        }
      })

      this._sockets.clear()

      this._httpServer.close(() => {
        this.emit('close')
        clearTimeout(this.closing)
        this.closing = undefined
        process.exit(0)
      })
    })
  }

  use (middleware) {
    this.app.use(middleware)
    return this
  }
}
