import { isString, isUndefined } from 'lodash'

export type StorageKey = {
  'kiwi:app:recent': number | string
}

export function getStorage(
  key: keyof StorageKey
): StorageKey[keyof StorageKey] | undefined {
  const data = localStorage.getItem(key)
  if (!data) return
  try {
    return JSON.parse(data) as StorageKey[keyof StorageKey]
  } catch {
    return data
  }
}

export function setStorage(
  key: keyof StorageKey,
  value: StorageKey[keyof StorageKey]
) {
  if (isUndefined(value)) removeStorage(key)
  else {
    if (isString(value)) localStorage.setItem(key, value)
    else localStorage.setItem(key, JSON.stringify(value))
  }
}

export function removeStorage(key: keyof StorageKey) {
  localStorage.removeItem(key)
}
