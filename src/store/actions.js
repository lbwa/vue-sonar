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
