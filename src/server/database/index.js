import * as connection from './connection'
import execute from './execute'
import table from './table'
import setup from './setup'

export default {
  ...connection,
  ...setup,
  execute,
  table
}
