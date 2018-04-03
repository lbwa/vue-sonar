<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>

    <h1 class="list-title" v-html="title"></h1>

    <div class="bg-image" :style="bgStyle">
      <div class="play-wrapper">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="play-content">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
  </div>
</template>

<script>
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

  computed: {
    bgStyle () {
      return {
        'background-image': `url(${this.bgImage})`
      }
    }
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
  .back {
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
  }
}
</style>
