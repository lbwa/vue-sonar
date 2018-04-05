import { playMode } from 'common/js/config'

const state = { // 只保留最基础的数据，由基础数据可计算得到的数据放置到 getters 中
  artist: {},
  playing: false, // 播放/暂停
  fullScreen: false, // 全屏
  playList: [],
  sequenceList: [], // 有特定顺序的 playlist
  mode: playMode.sequence, // 语义化值，而不是直接写属性值
  currentIndex: -1
}

export default state
