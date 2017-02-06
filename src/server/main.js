import {of} from 'most'
function Home () {
  return {
    HTTP: of({
      body: '<h1>Hello World!</h1>'
    })
  }
}

export default function Main (sources) {
  const page$ = sources.router.define({
    '/': Home
  }).map(({path, page}) => page({...sources, router: sources.router.path(path)}))

  return {
    HTTP: page$.map(({HTTP}) => HTTP).switch(),
    router: sources.history
  }
}
