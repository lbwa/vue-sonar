import * as types from './mutation-types'

const mutations = {
  [types.SET_ARTIST] (state, artist) {
    state.artist = artist
  }
}

export default mutations
