import http from 'http'
import express from 'express'

export default class HttpServerSource {
  _express = express()

  constructor (response$, options) {
    this._response$ = response$
  }

  run (sink, scheduler) {

  }
}
