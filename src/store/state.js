import { playMode } from 'common/js/config'

const state = { // 只保留最基础的数据，由基础数据可计算得到的数据放置到 getters 中
  artist: {},
  playing: false, // 播放/暂停
  fullScreen: false, // 全屏
  playlist: [], // 当前播放列表，其中顺序是 sequenceList 属性设置
  sequenceList: [], // 播放列表的播放顺序列表
  mode: playMode.sequence, // 语义化值，而不是直接写属性值
  currentIndex: -1, // 当前播放歌曲的索引，驱动歌曲的播放行为
  recommendItem: [], // 用户点击的推荐歌单项
  selectedTopList: [] // 用户点击的排行榜
}

export default state
