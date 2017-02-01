export function Main ({HTTP}) {
  return {
    HTTP: HTTP.map(...args => console.log(args))
  }
}

export default Main
