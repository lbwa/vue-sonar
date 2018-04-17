/**
 * mixin 中方法均会被各个组件中的同名属性方法覆盖
 */

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist' // 给各个函数传入 uex 中的 state 更易统一参数
    ])
  },

  mounted () {
    this.handlePlaylist(this.playlist)
  },

  activated () {
    this.handlePlaylist(this.playlist)
  },

  watch: {
    playlist (newList) {
      this.handlePlaylist(newList)
    }
  },

  methods: {
    handlePlaylist () {
      throw new Error('Component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  methods: {
    toggleIsFavorite (song) {
      if (this.isFavoriteSong(song)) {
        this.deleteMyFavoriteSong(song)
      } else {
        this.saveMyFavoriteSong(song)
      }
    },

    getFavoriteIcon (song) {
      return this.isFavoriteSong(song) ? 'icon-like' : 'icon-not-like'
    },

    isFavoriteSong (song) {
      return this.myFavoriteSongs.findIndex(item => item.id === song.id) > -1
    },

    togglePlayMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList) // 打乱顺序
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
      /**
       * 经试验，playlist 的改变不会导致 currentSong 的重新计算（在 watch 中设定一
       * 个 console ），currentIndex 会导致触发 watcher ，即 currentSong 会重新计
       * 算。
       */
    },
    // 保证 playlist 改变时不会改变当前播放歌曲
    resetCurrentIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      }) // 在修改后的 list 中找到当前播放的 index

      this.setCurrentIndex(index)
    },

    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),

    ...mapActions([
      'saveMyFavoriteSong',
      'deleteMyFavoriteSong'
    ])
  },

  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },

    ...mapGetters([
      'playlist',
      'mode',
      'sequenceList',
      'currentSong',
      'myFavoriteSongs'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      queryKey: '',
      refreshScrollDelay: 100 // 值大于等于 transition-group 动画的值(源于 search-list 组件)
    }
  },

  methods: {
    selectQueryRecord (item) {
      /**
       * 调用子组件方法传值的优势在于:
       * 1. 不用设置不必要的 props 和 watch
       * 2. 代码量更少
       * 适用于不需要监听的数据传递，注重传递这一行为
       */

      this.$refs.searchBox.setQuery(item)
    },

    getQueryKey (query) {
      this.queryKey = query
    },

    blurInputBox () {
      this.$refs.searchBox.blurInputBar()
    },

    saveSearchItem () {
      this.saveSearchHistory(this.queryKey)
    },

    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory' // 自动传入载荷
    ])
  },

  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  }
}
