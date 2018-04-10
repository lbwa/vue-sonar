/**
 * mixin 中方法均会被各个组件中的同名属性方法覆盖
 */

import { mapGetters } from 'vuex'

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
