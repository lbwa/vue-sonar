import { playMode } from 'common/js/config'
import { loadSearchData, loadPlayedSongs } from 'common/js/cache'

const state = { // 只保留最基础的数据，由基础数据可计算得到的数据放置到 getters 中
  artist: {},
  playing: false, // 播放/暂停
  fullScreen: false, // 全屏
  playlist: [], // 当前播放列表，其中的顺序即是播放顺序
  sequenceList: [], // 展示性播放列表
  mode: playMode.sequence, // 语义化值，而不是直接写属性值
  currentIndex: -1, // 当前播放歌曲的索引，驱动歌曲的播放行为
  recommendItem: [], // 用户点击的推荐歌单项
  selectedTopList: [], // 用户点击的排行榜
  searchHistory: loadSearchData(),
  playedHistory: loadPlayedSongs()
}

export default state

// TODO: 待验证 vuex searchHistory 异步被赋值
