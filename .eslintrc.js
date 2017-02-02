module.exports = {
  extends: [
    'standard'
  ],
  env: {
    worker: true,
    browser: true
  },
  globals: {
    ENV: true,
    DEBUG: true
  },
  parser: 'babel-eslint',
  plugins: [
    'html'
  ]
}
