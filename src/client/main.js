import {of} from 'most'
import {div, nav, main, h3, span, input} from '@motorcycle/dom'
import styles from './main.scss'

export const Main = ({DOM}) => {
  return {
    DOM: of(div([
      nav({class: {[styles.nav]: true, [styles['has-shadow']]: true}}, [
        div({class: {[styles['nav-left']]: true}}, [
          span({class: {[styles['is-brand']]: true, [styles['nav-item']]: true}}, [
            h3({class: {[styles.title]: true, [styles['is-3']]: true}}, document.title)
          ])
        ])
      ]),
      main({class: {[styles.section]: true, [styles['is-fluid']]: true}}, [
        div({class: {[styles.container]: true}}, [

        ])
      ])
    ]))
  }
}

export default Main
