import { isArray, isObject, isString, mapValues } from 'lodash'

export function mapData(data: any, handler: (item: any) => any): any {
  if (isArray(data)) return data.map(item => mapData(item, handler))
  if (isObject(data)) return mapValues(data, item => mapData(item, handler))
  return handler(data)
}

export function trimStringInData<T extends Dict>(data: T): T {
  return mapData(data, item => (isString(item) ? item.trim() : item))
}
