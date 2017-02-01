module.exports = {
  extends: [
    'standard'
  ],
  env: {
    worker: true,
    browser: true
  },
  globals: {
    ENV: true
  },
  parser: 'babel-eslint',
  plugins: [
    'html'
  ]
}
