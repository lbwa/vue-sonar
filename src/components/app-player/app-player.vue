<template>
  <div class="music-player" v-show="playList.length > 0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" alt="player-background">
      </div>
      <!-- 头部组件 -->
      <div class="parts-top">
        <div class="back-btn">
          <i class="icon-back"></i>
        </div>
        <h2 class="top-title">晴天</h2>
        <div class="top-subtitle">周杰伦</div>
      </div>
      <!-- 中间旋转组件 -->
      <div class="parts-middle">
        <div class="middle-album">
          <div class="cd-wrapper">
            <div class="cd">
              <!-- <img class="cd-img" width="100%" height="100%" alt="cd-img"> -->
            </div>
          </div>
          <p class="playing-lyric">晴天 - 周杰伦</p>
        </div>
        <div class="middle-lyric"></div>
      </div>
      <!-- 底部控制组件 -->
      <div class="parts-bottom">
        <div class="player-operators">
          <div class="icon icon-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon icon-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon icon-center">
            <i class="icon-play"></i>
          </div>
          <div class="icon icon-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon icon-right">
            <i class="icon icon-not-like"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="mini-player" v-show="!fullScreen">
      <div class="mini-icon">
        <img src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000MkMni19ClKG.jpg?max_age=2592000" width="40" height="40" alt="mini-icon">
      </div>
      <div class="mini-detail">
        <h2 class="detail-title">晴天</h2>
        <div class="detail-artist">周杰伦</div>
      </div>
      <div class="mini-control-btn">
        <i class="icon-mini icon-play-mini"></i>
      </div>
      <div class="mini-play-list">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.music-player {
  font-size: 0;
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(20px);
    }
    .parts-top {
      position: relative;
      margin-bottom: 25px;
      text-align: center;
      .back-btn {
        position: absolute;
        top: 0;
        left: 6px;
        width: 40px;
        height: 40px;
        text-align: center;
        .icon-back {
          display: block;
          transform: rotate(0.75turn); // 只能旋转块级元素
          line-height: 40px;
          color: $color-theme;
          font-size: $font-size-large-x;
        }
      }
      .top-title {
        @include ellipsis();
        font-size: $font-size-large;
        color: $color-text;
        line-height: 40px;
      }
      .top-subtitle {
        line-height: 20px;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .parts-middle {
      position: absolute;
      top: 80px;
      bottom: 170px;
      width: 100%;
      .middle-album {
        position: relative;
        padding-top: 80%;
        height: 0;
        .cd-wrapper {
          position: absolute;
          top: 0;
          left: 10%;
          height: 100%;
          width: 80%;
          .cd {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            .cd-img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .parts-bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .player-operators {
        display: flex;
        align-items: center;
        color: $color-theme;
        .icon {
          flex: 1;
        }
        .icon-left {
          text-align: right;
        }
        .icon-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .icon-right {
          text-align: left;
        }
        i {
          font-size: 30px;
        }
      }
    }
  }
  .mini-player {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: $color-background;
    .mini-icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
      }
    }
    .mini-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      overflow: hidden;
      .detail-title {
        margin-bottom: 2px;
        @include ellipsis();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .detail-artist {
        @include ellipsis();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .mini-control-btn {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini {
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
      }
    }
    .mini-play-list {
      @extend .mini-control-btn;
      .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
    }
  }
}

</style>
