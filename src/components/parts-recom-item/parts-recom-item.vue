<template>
  <transition name="slide">
    <PartsMusicList
      :bgImage="itemBgImage"
      :title="itemTitle"
      :songs="itemSongs"
    />
  </transition>
</template>

<script>
import PartsMusicList from 'components/parts-music-list/parts-music-list'
import { mapGetters } from 'vuex'
import { getRecommendItem } from 'api/the-recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/normalize-song'

export default {
  methods: {
    _getRecommendItem (id) {
      if (!this.recommendItem.dissid) { // 在 recommend 详情页刷新时，跳转至首页
        this.$router.push({ path: '/recommend' })
        return
      }

      getRecommendItem(id).then(res => {
        if (res.code === ERR_OK) {
          this.itemSongs = this._normalizeSongs(res.cdlist[0].songlist)
          console.info('%c Loading recommend songs', 'color: dodgerblue')
        } else {
          throw new Error('Check ERR_OK failed')
        }
      })
    },

    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songmid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },

  computed: {
    itemTitle () {
      if (!this.recommendItem.dissid) { // 在 recommend 详情页刷新时
        return
      }
      return this.recommendItem.creator.name
    },

    itemBgImage () {
      return this.recommendItem.imgurl
    },

    ...mapGetters([
      'recommendItem'
    ])
  },

  created () {
    this._getRecommendItem(this.recommendItem.dissid)
  },

  data () {
    return {
      itemSongs: []
    }
  },

  components: {
    PartsMusicList
  }
}
</script>

<style lang="scss" scoped>
.slide-enter, .slide-leave-to {
  transform: translateX(100%)
}
.slide-enter-active, .slide-leave-active {
  transition: all .3s
}
</style>
