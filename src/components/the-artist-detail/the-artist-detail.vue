<template>
  <transition name="slider">
    <MusicList
      :bgImage="bgImage"
      :title="title"
      :songs="songs"
    />
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArtistDetail } from 'api/the-artist'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/normalize-song'
import MusicList from 'components/the-music-list/the-music-list'

export default {
  data () {
    return {
      songs: []
    }
  },

  methods: {
    _getDetail () {
      if (!this.artist.id) {
        // 只有在点击歌手后 state.artist 才存在值
        // 在详情页刷新时，state.artist 为空对象，故在详情页刷新时将回到歌手页，这也是常见的边界情况处理方法
        this.$router.push('/artist')
        return
      }
      getArtistDetail(this.artist.id).then(res => {
        if (res.code === ERR_OK) {
        }
        this.songs = this._normalizeSongs(res.data.list)
      })
    },

    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },

  computed: {
    title () {
      return this.artist.name
    },

    bgImage () {
      return this.artist.avatar
    },
    ...mapGetters([
      'artist'
    ])
  },

  created () {
    this._getDetail()
  },

  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.slider-enter, .slider-leave-to {
  transform: translateX(100%);
}
.slider-enter-active, .slider-leave-active {
  transition: all .3s;
}
</style>
