import {of} from 'most'
import {main, h1} from '@motorcycle/dom'
import './main.scss'

export function App ({DOM}) {
  return {
    DOM: of(main([
      h1('Hello World', {class: {title: true, 'is-1': true}})
    ]))
  }
}

export default App
