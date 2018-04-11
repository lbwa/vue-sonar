<template>
  <transition name="slide">
    <PartsMusicList
      :bgImage="songsList.length ? songsList[0].image : ''"
      :title="selectedTopList.topTitle"
      :songs="songsList"
      :showRank="showRank"
    />
  </transition>
</template>

<script>
import PartsMusicList from 'components/parts-music-list/parts-music-list'
import { getFullRankingList } from 'api/the-ranking'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/normalize-song'

export default {
  data () {
    return {
      songsList: [], // 格式化后的歌曲容器
      showRank: true
    }
  },

  methods: {
    _getFullRankingList (id) {
      if (!this.selectedTopList.id) {
        this.$router.push({ path: '/ranking' })
        return
      }
      getFullRankingList(id).then(res => {
        if (res.code === ERR_OK) {
          this.songsList = this._normalizeSong(res.songlist)
        } else {
          throw new Error('Check ERR_OK failed.')
        }
      })
    },

    _normalizeSong (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.data.songmid && musicData.data.albumid) {
          ret.push(createSong(musicData.data))
        }
      })
      return ret
    }
  },

  created () {
    this._getFullRankingList(this.selectedTopList.id)
  },

  computed: {
    ...mapGetters([
      'selectedTopList'
    ])
  },

  components: {
    PartsMusicList
  }
}
</script>

<style lang="scss" scoped>
.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}
</style>
