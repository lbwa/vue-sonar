<template>
  <transition name="slide">
    <div class="add-to-list" v-show="hasShowComponent">

      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close-btn" @click="hideComponent">
          <i class="icon-close"></i>
        </div>
      </div>

      <div class="search-box-wrapper">
        <BaseSearchBox placeholder="搜索歌曲、歌手" @queryChange="getQueryKey"/>
      </div>

      <div class="shortcut" v-show="!queryKey">
        <BaseSwitches
          :switchOptions="switchOptions" :currentSwitchIndex="switchIndex"
          @selectSwitch="toggleSwitchIndex"
        />

        <div class="list-wrapper"></div>
      </div>

      <div class="search-result-wrapper" v-show="queryKey">
        <PartsResult :query="queryKey" :showArtist="false"/>
      </div>

    </div>
  </transition>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import BaseSwitches from 'base/base-switches/base-switches'
import PartsResult from 'components/parts-search-result/parts-search-result'

export default {
  data () {
    return {
      hasShowComponent: false,
      switchOptions: [{ name: '最近播放' }, { name: '搜索历史' }],
      switchIndex: 0,
      queryKey: ''
    }
  },

  methods: {
    toggleSwitchIndex (index) {
      this.switchIndex = (index++) % 2
    },

    getQueryKey (query) {
      this.queryKey = query
    },

    showComponent () {
      this.hasShowComponent = true
    },

    hideComponent () {
      this.hasShowComponent = false
    }
  },

  components: {
    BaseSearchBox,
    BaseSwitches,
    PartsResult
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.add-to-list {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-background;
  z-index: 1000; // TODO: 隐藏 playlist ?
  &.slide-enter, &.slide-leave-to {
    transform: translateX(100%)
  }
  &.slide-enter-active, &.slide-leave-active {
    transition: all .3s;
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close-btn {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .search-result-wrapper {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

</style>
