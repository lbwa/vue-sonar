// 异步操作或对 mutations 的封装（封装需要一次触发多个 mutations 的操作）

import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearchItem, deleteSearchItem, deleteAllSearchItem, savePlayedSongs } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 歌单（主页，歌手，排行榜）中点击歌曲播放整个歌单

export const selectedPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)

  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true) // 默认点击歌曲后全屏播放
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({ commit }, { list }) => {
  let randomList = shuffle(list)

  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 将单曲插入当前播放列表中

export const insertSong = ({ commit, state }, song) => {
  /**
   * 为了在之后使用 Array.prototype.splice() 方法，这里使用拓展运算符浅复制数组
   * 原因：
   * 1. 因为在 JavaScript 中操作对象的实质是操作对象指针，那么在不复制数组的情况下使
   * 用数组 splice() 方法将会修改原数组。
   * 2. 第一点的这个行为与在 vuex 中必须通过mutation 来修改 state 的原则相悖。继而报
   * 错 Do not mutate vuex store state outside mutation handlers。
   */

  let playlist = [...state.playlist]
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex // 当前在 playlist 中的索引

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 判断当前歌曲是否已存在，若存在则返回索引
  let fqIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引 +1
  currentIndex++
  // 插入目标歌曲到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 查找结果是存在目标歌曲
  if (fqIndex > -1) {
    if (currentIndex > fqIndex) {
      // 若当前插入索引大于列表中的索引，即在原索引之后
      playlist.splice(fqIndex, 1)
      currentIndex-- // 因为原单项已被删除，所以 -1
    } else {
      // 若当前插入索引不大于列表中的索引，即在原索引之前
      playlist.splice(fqIndex + 1, 1)
    }
  }

  let sequenceCurrentIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(sequenceCurrentIndex, 0, song)

  if (fsIndex > -1) {
    if (sequenceCurrentIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索记录

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearchItem(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearchItem(query))
}

export const clearAllHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, deleteAllSearchItem())
}

// 播放列表

export const deleteSongFromList = function ({ commit, state }, {song, index}) {
  // 传入的 Index 即是展示性列表 sequenceList 中的 Index
  let playlist = [...state.playlist]
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex

  const indexInPlaylist = findIndex(playlist, song)
  // const indexInSequenceList = findIndex(sequenceList, song) // 即为 index

  playlist.splice(indexInPlaylist, 1)
  sequenceList.splice(index, 1)

  if (currentIndex > indexInPlaylist || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0

  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteAllSongsFromList = function ({ commit }) {
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}

// 最近播放列表

export const savePlayedHistory = function ({ commit }, song) {
  commit(types.SET_PLAYED_HISTORY, savePlayedSongs(song))
}
