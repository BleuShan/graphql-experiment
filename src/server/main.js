import {fromEvent} from 'most'

export function Main ({HTTP}) {
  return {
    HTTP: HTTP.continueWith(({request, response}) => {
      response.writeHead(200, {'Content-Type': 'text/html'})

      return fromEvent('end', request).map(() => response.end('<h1>Hello world!</h1>'))
    })
  }
}

export default Main
