<template>
<div class="recommend"  ref="recommendScroll">
  <div class="recommend-wrapper"><!-- betterScroll -->
    <!-- 轮播图 -->
    <div v-if="recommendList.length" class="slider-wrapper"><!-- 仅做 dots 定位的参照物 -->
      <BaseSlider :sliderData="recommendList"></BaseSlider>
    </div>
    <!-- 推荐列表 -->
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul class="list-content"></ul>
    </div>
  </div>
</div>
</template>

<script>
import { getRecommend } from '@/api/the-recommend'
import { ERR_OK } from '@/api/config'
import BaseSlider from 'base/base-slider'

export default {
  data () {
    return {
      recommendList: []
    }
  },

  computed: {},

  methods: {
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList = res.data.slider
        }
      })
    }
  },

  created () {
    this._getRecommend()
  },

  components: {
    BaseSlider
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.recommend {
  .recommend-list {
    .list-title {
      text-align: center;
      height: 65px;
      line-height: 65px;
      font-size: 14px;
      color: $color-theme;
    }
  }
}
</style>
