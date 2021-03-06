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
          :switchOptions="switchOptions"
          :currentSwitchIndex="switchIndex"
          @selectSwitch="toggleSwitchIndex"
        />

        <div class="list-wrapper">
          <!-- 最近播放 -->
          <BaseScroll
            class="scroll-wrapper"
            ref="scrollPlayedList"
            v-if="switchIndex === 0"
            :data="playedHistory"
          >
            <div class="currentPlay-list">
              <BaseSongsList :songsData="playedHistory" @select="selectedSong"/>
            </div>
          </BaseScroll>
          <!-- 搜索历史 -->
          <BaseScroll
            class="scroll-wrapper"
            ref="scrollSearchList"
            v-if="switchIndex === 1"
            :data="searchHistory"
            :refreshDelay="refreshScrollDelay"
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
          @selectQuery="saveSearch"
          @listScrolling="blurInputBox"
        />
      </div>

      <BaseTopTip ref="topTip" :hideDelay="topTipDelay">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经添加到列表</span>
        </div>
      </BaseTopTip>

    </div>
  </transition>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import BaseScroll from 'base/base-scroll'
import BaseSearchList from 'base/base-search-list'
import BaseSwitches from 'base/base-switches/base-switches'
import BaseSongsList from 'base/base-songs-list/base-songs-list'
import BaseTopTip from 'base/base-top-tip/base-top-tip'
import PartsResult from 'components/parts-search-result/parts-search-result'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from 'common/js/mixin'
import Song from 'common/js/normalize-song'

export default {
  mixins: [searchMixin],

  data () {
    return {
      hasShowComponent: false,
      switchOptions: [{ name: '最近播放' }, { name: '搜索历史' }],
      switchIndex: 0,
      topTipDelay: 2000
    }
  },

  methods: {
    showTopTip () {
      this.$refs.topTip.showTopTip()
    },

    selectedSong (song, index) {
      // song 来自 localeStorage ,转换为 Song 的实例，这样才会具有 lyric 方法
      if (index) {
        this.insertSong(new Song(song))
        this.showTopTip()
      }
    },

    saveSearch () {
      this.saveSearchItem()
      this.showTopTip()
    },

    toggleSwitchIndex (index) {
      this.switchIndex = index
    },

    showComponent () {
      this.hasShowComponent = true
      setTimeout(() => { // this.$nextTick 的一种实现
        if (this.switchIndex === 0) {
          this.$refs.scrollPlayedList.refresh()
        } else {
          this.$refs.scrollSearchList.refresh()
        }
      }, 20)
    },

    hideComponent () {
      this.hasShowComponent = false
    },

    ...mapActions([
      'insertSong'
    ])
  },

  computed: {
    ...mapGetters([
      'playedHistory'
    ])
  },

  components: {
    BaseSearchBox,
    BaseScroll,
    BaseSearchList,
    BaseSwitches,
    BaseSongsList,
    BaseTopTip,
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
  .tip-title {
    text-align: center;
    padding: 18px 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}

</style>
