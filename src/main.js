import {run} from '@cycle/most-run'
import ExecutionEnvironment from 'exenv'

function runApp ([main, drivers]) {
  run(main, drivers)
}

let promise
if (ExecutionEnvironment.canUseDOM && ExecutionEnvironment.canUseViewport) {
  promise = Promise.all([
    import('./client/main'),
    import('./client/drivers')
  ])
} else {
  promise = Promise.all([
    import('./server/main'),
    import('./server/drivers')
  ])
}

promise
  .then(modules => modules.map(module => module.default))
  .then(runApp)
  .catch(console.error)
