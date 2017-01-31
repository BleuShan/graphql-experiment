import {run} from '@cycle/most-run'
import ExecutionEnvironment from 'exenv'

let drivers
let main
if (ExecutionEnvironment.canUseDOM) {
  drivers = require('./client/drivers')
  main = require('./client/main.js')
} else {
  drivers = require('./server/drivers')
  main = require('./server/main.js')
}

run(main, drivers)
