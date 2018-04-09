<template>
  <div class="music-list">
    <div class="back-btn" @click="back">
      <i class="icon-back"></i>
    </div>

    <h1 class="list-title" v-html="title" ref="title"></h1>
    <!-- header 背景图 -->
    <div
      class="bg-image"
      ref="background"
      :style="[bgStyle, scrollStyle]"
    >
      <div class="play-wrapper">
        <div class="play-btn" ref="playBtn" v-show="songs.length" @click="randomPlaySong">
          <i class="icon-play"></i>
          <span class="play-content">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div><!-- 特效层-->
    </div>
    <!-- 歌曲列表 -->
    <div class="bg-layer" ref="layer"></div><!-- 模拟上移层 -->
    <BaseScroll
      class="songs-list-wrapper"
      ref="list"
      :probeType="probeType"
      :listenScroll="listenScroll"
      :data="songs"
      @scroll="scrollSongsList"
    >
      <BaseSongList :songsData="songs" @select="selectedSong"/>

      <div v-if="songs.length === 0" class="loading-wrapper">
        <BaseLoading/>
      </div>
    </BaseScroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BaseSongList from 'base/base-songs-list'
import BaseScroll from 'base/base-scroll'
import BaseLoading from 'base/base-loading/base-loading'
import { prefixStyle } from 'common/js/control-dom'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      scrollY: 0,
      scrollStyle: {} // 滚动歌曲列表时设置 title 的样式
    }
  },

  methods: {
    ...mapActions([
      'selectedPlay',
      'randomPlay'
    ]),
    back () {
      this.$router.back()
    },
    scrollSongsList (pos) {
      this.scrollY = pos.y
    },

    selectedSong (item, index) {
      this.selectedPlay({
        list: this.songs, // 传入整个歌单而非单曲，以填充播放列表
        index // 传入点击的索引，以知晓当前应该播放的歌曲
      })
    },

    randomPlaySong () {
      this.randomPlay({
        list: this.songs
      })
    }
  },

  watch: {
    scrollY (newY) {
      const translate = -newY > this.limitLength ? -this.limitLength : newY

      /**
      * this.bgImageHeight * (newY / this.bgImageHeight) 等于 newY
      * bgImageHeight 的增量为 newY 的绝对值，进而无缝衔接
      */

      const scalePercent = Math.abs(newY / this.bgImageHeight)
      const blurPercent = Math.min(20 * scalePercent, 20)

      // bg-layer
      this.$refs.layer.style[transform] = `translateY(${translate}px)`

      // bg-image
      if (-newY >= this.limitLength) {
        this.scrollStyle = {
          'z-index': 10,
          'padding-top': 0,
          height: `${RESERVED_HEIGHT}px`
        }
        this.$refs.playBtn.style.display = 'none' // 隐藏播放键
      } else {
        this.scrollStyle = {}
        this.$refs.playBtn.style.display = ''
      }

      // backdrop-filter 仅限 IOS
      this.$refs.filter.style[backdrop] = `blur(${blurPercent}px)`

      // 下拉列表
      if (newY > 0) {
        this.scrollStyle = {
          transform: `scale(${1 + scalePercent})`,
          'webkit-transform': `scale(${1 + scalePercent})`,
          'z-index': 10
        }
      }
    }
  },

  computed: {
    bgStyle () {
      return {
        'background-image': `url(${this.bgImage})`
      }
    }
  },

  created () {
    this.probeType = 3
    this.listenScroll = true
  },

  mounted () {
    this.$refs.list.$el.style.top = `${this.$refs.background.clientHeight}px`

    this.bgImageHeight = this.$refs.background.clientHeight

    this.limitLength = this.bgImageHeight - RESERVED_HEIGHT // 歌曲列表最大上升高度
  },

  components: {
    BaseSongList,
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-background;
  font-size: 0;
  .back-btn {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .list-title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    @include ellipsis();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    padding-top: 70%;
    transform: scale(1);
    z-index: 0;
    height: 0;
    width: 100%;
    transform-origin: top; // 更改变形原点
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        .icon-play, .play-content {
          display: inline-block;
          vertical-align: middle;
        }
        .icon-play {
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .play-content {
          font-size: $font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-background;
  }
  .songs-list-wrapper {
    position: fixed;
    bottom: 0; // top 在 mounted 钩子实现
    width: 100%;
    // overflow: hidden; // 设置 title 的 z-index 来实现相同效果
    .loading-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
}
</style>
