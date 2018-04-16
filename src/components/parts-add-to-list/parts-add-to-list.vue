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
        <BaseSearchBox
          ref="searchBox" placeholder="搜索歌曲"
          @queryChange="getQueryKey"
        />
      </div>

      <div class="shortcut" v-show="!queryKey">
        <BaseSwitches
          :switchOptions="switchOptions" :currentSwitchIndex="switchIndex"
          @selectSwitch="toggleSwitchIndex"
        />

        <div class="list-wrapper">
          <BaseScroll class="scroll-wrapper" v-if="switchIndex === 0">
            <div class="currentPlay-list"></div>
          </BaseScroll>
          <BaseScroll
            class="scroll-wrapper"
            ref="scrollSearchList"
            v-if="switchIndex === 1"
            :data="searchHistory"
          >
          <!-- better-scroll 组件封装，其子元素不能直接是另一个组件，子组件必须有一个包裹，否则无法正确挂载 -->
            <div class="result-wrapper">
              <BaseSearchList
                :searchData="searchHistory"
                @selectItem="selectQueryRecord"
                @deleteItem="deleteSearchHistory"
              />
            </div>
          </BaseScroll>
        </div>
      </div>

      <div class="search-result-wrapper" v-show="queryKey">
        <PartsResult
          :query="queryKey"
          :showArtist="false"
          @selectQuery="saveSearchItem"
          @listScrolling="blurInputBox"
        />
      </div>

    </div>
  </transition>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import BaseScroll from 'base/base-scroll'
import BaseSearchList from 'base/base-search-list'
import BaseSwitches from 'base/base-switches/base-switches'
import PartsResult from 'components/parts-search-result/parts-search-result'
import { searchMixin } from 'common/js/mixin'

export default {
  mixins: [searchMixin],

  data () {
    return {
      hasShowComponent: false,
      switchOptions: [{ name: '最近播放' }, { name: '搜索历史' }],
      switchIndex: 0
    }
  },

  methods: {
    toggleSwitchIndex (index) {
      this.switchIndex = index
    },

    showComponent () {
      this.hasShowComponent = true
      setTimeout(() => {
        if (this.switchIndex === 0) {
          // TODO:
        } else {
          this.$refs.scrollSearchList.refresh()
        }
      }, 20)
    },

    hideComponent () {
      this.hasShowComponent = false
    }
  },

  components: {
    BaseSearchBox,
    BaseScroll,
    BaseSearchList,
    BaseSwitches,
    PartsResult
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.add-to-list {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-background;
  z-index: 200;
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
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow: hidden;
      .search-list {
        padding: 20px 30px;
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
