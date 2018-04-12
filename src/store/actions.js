// 异步操作或对 mutations 的封装（封装需要一次触发多个 mutations 的操作）

import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

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
