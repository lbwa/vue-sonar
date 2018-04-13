// localStorage 仓库

// localforage 库是异步本地储存的，因异步读取机制， state 中无法得到 localStorage 正确的值，故弃用，转而使用 store.js 进行同步存储和读取数据

import localStorage from 'store/dist/store.modern'

// import localforage from 'localforage'
// 指定 localforage 库的存储驱动，该处为 localStorage，待选 WebSQL 和 IndexedDB

// localforage.setDriver(localforage.LOCALSTORAGE)

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArray (arr, value, compare, maxLength) {
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

// localforage 异步存储 search data

// export async function saveSearch (query) {
//   let searches = []

//   await localforage.getItem(SEARCH_KEY).then(value => {
//     searches = value || []
//   })

//   insertArray(searches, query, item => {
//     return item === query
//   }, SEARCH_MAX_LENGTH)

//   await localforage.setItem(SEARCH_KEY, searches)

//   return searches
// }

export function saveSearch (query) {
  let searches = localStorage.get(SEARCH_KEY) || []

  insertArray(searches, query, item => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  localStorage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearchData () {
  return localStorage.get(SEARCH_KEY) || []
}
