export const artist = state => state.artist

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = state => { // 经试验，修改 playlist 不会导致 currentSong 重新计算
  return state.playList[state.currentIndex] || {}
}
