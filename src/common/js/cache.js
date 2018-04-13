// localStorage 仓库

// localforage 库是异步本地储存的，因异步读取机制， state 中无法得到 localStorage 正确的值，故弃用，转而使用 store.js 进行同步存储和读取数据

import localStorage from 'store/dist/store.modern'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertItem (arr, value, compare, maxLength) {
  const index = arr.findIndex(compare)

  if (index === 0) { // 若是第一个数据
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(value) // 若仓库不存在被查询数据

  if (maxLength && arr.length > maxLength) {
    arr.pop() // 超过限定长度时，删除最后一项
  }
}

function deleteItem (arr, compare) {
  const index = arr.findIndex(compare)

  if (index >= 0) {
    arr.splice(index, 1)
  }
}

// export function

export function saveSearchItem (query) {
  let searches = localStorage.get(SEARCH_KEY) || []

  insertItem(searches, query, item => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  localStorage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearchData () {
  return localStorage.get(SEARCH_KEY) || []
}

export function deleteSearchItem (query) {
  let searches = localStorage.get(SEARCH_KEY)

  deleteItem(searches, item => {
    return item === query
  })

  localStorage.set(SEARCH_KEY, searches)

  return searches
}

export function deleteAllSearchItem () {
  localStorage.remove(SEARCH_KEY)
  return []
}

/**
 * 1. localforage 异步存储 search data
 * 2. localforage 库可指定存储驱动，默认优先级为 IndexedDB、WebSQL、localStorage
 */

// import localforage from 'localforage'

// localforage.setDriver(localforage.LOCALSTORAGE)

// export async function saveSearch (query) {
//   let searches = []

//   await localforage.getItem(SEARCH_KEY).then(value => {
//     searches = value || []
//   })

//   insertItem(searches, query, item => {
//     return item === query
//   }, SEARCH_MAX_LENGTH)

//   await localforage.setItem(SEARCH_KEY, searches)

//   return searches
// }
