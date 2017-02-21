import uniq from 'lodash/uniq'

export function addUp (data) {
  const keys = uniq(data.map(d => Object.keys(d)[0]))
  const result = []

  keys.forEach(key => {
    result[key] = 0
  })

  data.forEach(d => {
    const key = Object.keys(d)[0]
    result[key] += d[key]
  })

  return Object.keys(result)
    .map(key => ({ name: key, count: result[key] }))
    .sort((prev, curr) => curr.count - prev.count)
}
