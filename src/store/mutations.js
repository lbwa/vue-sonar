import * as types from './mutation-types'

const mutations = {
  [types.SET_ARTIST] (state, artist) {
    state.artist = artist
  },

  [types.SET_PLAYING_STATE] (state, playing) {
    state.playing = playing
  },

  [types.SET_FULL_SCREEN] (state, fullScreen) {
    state.fullScreen = fullScreen
  },

  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },

  [types.SET_SEQUENCE_LIST] (state, sequenceList) {
    state.sequenceList = sequenceList
  },

  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },

  [types.SET_CURRENT_INDEX] (state, currentIndex) {
    state.currentIndex = currentIndex
  },

  [types.SET_RECOMMEND_ITEM] (state, recommendItem) {
    state.recommendItem = recommendItem
  },

  [types.SET_SELECTED_TOP_LIST] (state, selectedTopList) {
    state.selectedTopList = selectedTopList
  },

  [types.SET_SEARCH_HISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  }
}

export default mutations
