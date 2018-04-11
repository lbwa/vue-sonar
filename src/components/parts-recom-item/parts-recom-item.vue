<template>
  <transition name="slide">
    <PartsMusicList
      :bgImage="recommendItem.imgurl"
      :title="recommendItem.creator.name"
    />
  </transition>
</template>

<script>
import PartsMusicList from 'components/parts-music-list/parts-music-list'
import { mapGetters } from 'vuex'
import { getRecommendItem } from 'api/get-recommend-item'

export default {
  methods: {
    _getRecommendItem (id) {
      console.log(id)
      getRecommendItem(id).then(res => console.log(res))
    }
  },
  computed: {
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
