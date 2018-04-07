<template>
  <div class="music-player" v-show="playList.length > 0">
    <!-- @leave="leave" 是与我定义的样式无关，因为删除样式一样 leava-to 会卡住 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
    ><!-- 待解决 @leave="leave" 与 leave-active leave-to 冲突 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img
            :src="currentSong.image"
            width="100%" height="100%" alt="player-background"
          >
        </div>
        <!-- 头部组件 -->
        <div class="parts-top">
          <div class="back-btn" @click="closeFullScreen">
            <i class="icon-back"></i>
          </div>
          <h2 class="top-title" v-html="currentSong.name"></h2>
          <div class="top-subtitle" v-html="currentSong.artist"></div>
        </div>
        <!-- 中间旋转组件 -->
        <div class="parts-middle">
          <div class="middle-album">
            <div class="cd-wrapper" ref="cd">
              <div :class="['cd', rotateCD]">
                <img
                  :src="currentSong.image"
                  class="cd-img"
                  width="100%" height="100%" alt="cd-img"
                >
              </div>
            </div>
            <p class="playing-lyric">lyric area</p>
          </div>
          <div class="middle-lyric"></div>
        </div>
        <!-- 底部控制组件 -->
        <div class="parts-bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ currentTime | formatTime }}</span>
            <div class="progress-bar-wrapper"></div>
            <span class="time time-r">{{ currentSong.duration | formatTime }}</span>
          </div>
          <!-- 播放控件 -->
          <div class="player-operators">

            <div class="icon icon-left">
              <i class="icon-sequence"></i>
            </div>
            <div :class="['icon', 'icon-left', disableBtn]">
              <i class="icon-prev" @click="prevSong"></i>
            </div>

            <div
              :class="['icon', 'icon-center', disableBtn]"
              @click="togglePlaying"
            >
              <i :class="[playing ? 'icon-pause' : 'icon-play']"></i>
            </div>

            <div :class="['icon', 'icon-right', disableBtn]">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon icon-not-like"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">

        <div class="mini-icon">
          <div :class="['img-wrapper', rotateCD]"><!-- 用于按重心旋转 -->
            <img
              :src="currentSong.image"
              width="40" height="40" alt="mini-icon"
            >
          </div>
        </div>

        <div class="mini-detail">
          <h2 class="detail-title" v-html="currentSong.name"></h2>
          <div class="detail-artist" v-html="currentSong.artist"></div>
        </div>

        <div class="mini-control-btn" @click.stop.prevent="togglePlaying">
          <i :class="[playing ? 'icon-pause-mini' : 'icon-play-mini']"></i>
        </div>

        <div class="mini-play-list">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- w3c audio:canplay 事件在资源可播放时触发 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="readyPlay" @error="errorPlay" @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/control-dom'

const transform = prefixStyle('transform')

export default {
  data () {
    return {
      songReady: false, // 用于限制点击行为
      currentTime: 0
    }
  },

  methods: {
    /**
     * 监听 canplay 事件是为防止 DOMException: The play() request was
     * interrupted by a new load request (原因：play()方法执行应在资源加载完成之后)
     */
    readyPlay () {
      this.songReady = true
    },

    errorPlay () {
      this.songReady = true // 保证在无法加载资源的情况下，其他按键的功能正常
    },

    togglePlaying () {
      if (!this.songReady) { return }
      this.setPlayingState(!this.playing)
    },

    closeFullScreen () {
      // 点击关闭按钮一定是关闭全屏，而不是 !this.fullScreen 切换状态
      this.setFullScreen(false)
    },

    openFullScreen () {
      this.setFullScreen(true)
    },
    // 修复暂停时，点击下一曲或上一曲的错误显示
    fixPlayingStatus () {
      if (!this.playing) {
        this.togglePlaying()
      }
    },

    prevSong () {
      if (!this.songReady) { return }
      // 因为只能是 mutations 修改 state ，故不能写 this.currentIndex--
      const index = this.currentIndex === 0 ? this.playList.length - 1 : this.currentIndex - 1
      this.setCurrentIndex(index)
      this.fixPlayingStatus()
      this.songReady = false // songReady 复位
    },

    nextSong () {
      if (!this.songReady) { return }
      // 原因同 prevSong, this.currentIndex++ 存在赋值行为
      const index = this.currentIndex === this.playList.length - 1 ? 0 : this.currentIndex + 1
      this.setCurrentIndex(index)
      this.fixPlayingStatus()
      this.songReady = false // songReady 复位
    },

    timeUpdate (evt) {
      this.currentTime = evt.target.currentTime
    },

    // vue transition 动画 hook
    enter (el, done) {
      const { x, y, scale } = this._getPositionAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // done 为 enter 钩子的回调函数，执行效果是调用下一阶段钩子，这里是 afterEnter
      animations.runAnimation(this.$refs.cd, 'move', done)
    },

    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cd.style.animation = ''
    },

    leave (el, done) {
      const { x, y, scale } = this._getPositionAndScale()
      // const transform = prefixStyle('transform')
      this.$refs.cd.style[transform] = `translate3d(${x}, ${y}, 0) scale(${scale})`
      this.$refs.cd.style.transition = `all 0.4s`
      this.$refs.cd.addEventListener('transitioned', done)
    },

    afterLeave () {
      this.$refs.cd.style.transition = ''
      this.$refs.cd.style[transform] = ''
    },

    _getPositionAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30 // mini logo 距底边的距离
      const paddingTop = 80 // .parts-top {top: 80px}
      // window.innerWidth 视口（含滚动条）宽度
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

      return { x, y, scale }
    },

    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },

  filters: {
    formatTime (value) {
      value = value | 0 // 等同于 Math.floor
      const min = value / 60 | 0
      // Number.prototype.toLocaleString() 格式化数字为字符串
      const sec = (value % 60).toLocaleString('zh', { minimumIntegerDigits: 2 })
      return `${min}:${sec}`
    }
  },

  watch: {
    // nextTick 防止报错 DOMException: The play() request was interrupted by a new load request (原因：异步请求)
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },

    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => { // 同 currentSong（执行 DOM 方法时在数据更新之后）
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },

  computed: {
    rotateCD () {
      return this.playing ? 'play' : 'play pause'
    },

    disableBtn () {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg)
  }
}

%rotate {
  &.play {
    animation: rotate 20s linear infinite;
  }
  &.pause {
    animation-play-state: paused
  }
}

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
            @extend %rotate;
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
      .progress-wrapper {
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
        }
      }
      .player-operators {
        display: flex;
        align-items: center;
        color: $color-theme;
        .icon {
          flex: 1;
          &.disable {
            color: $color-theme-d;
          }
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
    &.normal-enter-active, &.normal-leave-active {
      transition: all .4s;
      .parts-top, .parts-bottom {
        transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to {
      opacity: 0;
      // Chrome 有一定几率出现只有一个类(top / bottom)被正常添加(进入动画)，IOS 正常
      .parts-top {
        transform: translate3d(0, -100px, 0);
      }
      .parts-bottom {
        transform: translate3d(0, 100px, 0);
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
    &.mini-enter-active, &.mini-leave-active {
      transition: all .4s;
    }
    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }
    .mini-icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      .img-wrapper {
        @extend %rotate;
        img {
          border-radius: 50%;
        }
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
      .icon-play-mini, .icon-pause-mini {
        font-size: 32px;
        color: $color-theme-d;
      }
      .icon-pause-mini {
        color: $color-theme;
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
