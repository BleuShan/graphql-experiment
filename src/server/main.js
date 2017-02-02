export function Main ({HTTP}) {
  return {
    HTTP: HTTP.map((request) => {
      return {
        body: `<h1>Hello World!</h1>`
      }
    })
  }
}

export default Main
