import {of} from 'most'
import {div, nav, main, h1} from '@motorcycle/dom'
import styles from './main.scss'

export const App = ({DOM}) => {
  return {
    DOM: of(div([
      nav('#appbar', {props: {class: {[styles.nav]: true, [styles['has-shadow']]: true}}}, [
        div(`.${styles.container}`, [
          h1('', {class: {[styles.title]: true, [styles['is-1']]: true}}, ['Hello World'])
        ])
      ]),
      main(`.${styles.section}`, [
        div(`.${styles.container}`, {class: {[styles.container]: true}})
      ])
    ]))
  }
}

export default App
