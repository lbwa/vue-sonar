// localStorage 仓库

/**
 * 弃用 localforage 原因：
 * 1. localforage 库是异步本地储存的，因异步读取机制。
 * 2. 除非将整个 state 对象包裹在异步函数中，否则 state 中依赖 localStorage 的值属性
 * 无法异步被赋值为 localStorage 的值，故弃用，转而使用 store.js 进行同步存储和读取数
 * 据
 * 3. 个人认为将 state 包裹在回调中，代码相对于同步取值来说不够简洁
 */

import localStorage from 'store/dist/store.modern'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 20

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
