import moment from 'moment'

export function routeQueryTransform (query) {
  const format = 'YYYY-MM-DD'
  const ret = {}
  ret.page = +query.page || 1
  ret.limit = +query.limit || 10
  ret.from = query.from || moment().add(-7, 'days').format(format)
  ret.to = query.to || moment().format(format)
  if (query.hasOwnProperty('children')) {
    const children = JSON.parse(query.children)
    ret.children = children
  } else {
    ret.children = []
  }
  return ret
}

export function dupQuery (query) {
  return JSON.parse(JSON.stringify(query))
}