<template>
  <transition name="slide">
    <PartsMusicList
      :bgImage="itemBgImage"
      :title="itemTitle"
    />
  </transition>
</template>

<script>
import PartsMusicList from 'components/parts-music-list/parts-music-list'
import { mapGetters } from 'vuex'
import { getRecommendItem } from 'api/the-recommend'
// import { ERR_OK } from 'api/config'

export default {
  methods: {
    _getRecommendItem (id) {
      console.log(true)
      getRecommendItem(id).then(res => console.log(res))
    }
  },
  computed: {
    itemTitle () {
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
