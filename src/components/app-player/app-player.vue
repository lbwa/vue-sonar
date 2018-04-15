<template>
  <div class="music-player" v-show="playlist.length > 0">
    <!-- @leave="leave" 是与我定义的样式无关，因为删除样式一样 leave-to 类名会卡住 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      type="transition"
    ><!-- FIXME: @leave="leave" 与 leave-active leave-to 冲突 -->
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
        <div
          class="parts-middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-album" ref="album">
            <div class="cd-wrapper" ref="cdWrapper">
              <div :class="['cd', rotateCD]">
                <img
                  :src="currentSong.image"
                  class="cd-img"
                  width="100%" height="100%" alt="cd-img"
                >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{ playingLyric }}</p>
            </div>
          </div>

          <BaseScroll
            class="middle-lyric" ref="lyricList"
            :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  v-for="(item, index) of currentLyric.lines"
                  :class="['lyric-text', currentLineNum === index ? 'current' : '']"
                  :key="index"
                >{{ item.txt }}</p>
              </div>
            </div>
          </BaseScroll>
        </div>

        <!-- 底部控制组件 -->
        <div class="parts-bottom">
          <div class="dot-wrapper">
            <span :class="['dot', currentShow === 'cd' ? 'active' : '']"></span>
            <span :class="['dot', currentShow === 'lyric' ? 'active' : '']"></span>
          </div>
          <!-- 进度条时间 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ currentTime | formatTime }}</span>
            <div class="progress-bar-wrapper">
              <BaseProgressBar :currentPercent="playPercent" @percentChange="onProgressChange"/>
            </div>
            <span class="time time-r">{{ currentSong.duration | formatTime }}</span>
          </div>
          <!-- 播放控件 -->
          <div class="player-operators">

            <div class="icon icon-left" @click="togglePlayMode">
              <i :class="iconMode"></i>
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
          <BaseProgressCircle :radius="radius" :percent="playPercent">
            <i :class="['icon-mini', playing ? 'icon-pause-mini' : 'icon-play-mini']"></i>
          </BaseProgressCircle>
        </div>

        <div class="mini-play-list" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <PartsPlaylist ref="playlist"/>

    <!-- w3c audio:canplay 事件在资源可播放时触发 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="readyPlay" @error="errorPlay" @timeupdate="timeUpdate" @ended="endPlay"
    ></audio>
  </div>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import BaseProgressBar from 'base/base-progress-bar'
import BaseProgressCircle from 'base/base-progress-circle'
import PartsPlaylist from 'components/parts-playlist/parts-playlist'
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from 'common/js/control-dom'
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'
import animations from 'create-keyframe-animation'
import LyricParser from 'lyric-parser'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false, // 用于限制点击行为
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
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

      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },

    closeFullScreen () {
      // 点击关闭按钮一定是关闭全屏，而不是 !this.fullScreen 切换状态
      this.setFullScreen(false)
    },

    openFullScreen () {
      this.setFullScreen(true)
    },

    showPlaylist () {
      this.$refs.playlist.showPlaylist()
    },

    // 修复暂停时，点击下一曲或上一曲的错误显示
    fixPlayingStatus () {
      if (!this.playing) {
        this.togglePlaying()
      }
    },

    prevSong () {
      if (!this.songReady) { return }

      if (this.playlist.length === 1) {
        this.loopPlay()
      } else {
        // 因为只能是 mutations 修改 state ，故不能写 this.currentIndex--
        const index = this.currentIndex === 0 ? this.playlist.length - 1 : this.currentIndex - 1
        this.setCurrentIndex(index)
      }
      this.fixPlayingStatus()
      this.songReady = false // songReady 复位
    },

    nextSong () {
      if (!this.songReady) { return }
      // 原因同 prevSong, this.currentIndex++ 存在赋值行为

      if (this.playlist.length === 1) {
        this.loopPlay()
      } else {
        const index = this.currentIndex === this.playlist.length - 1 ? 0 : this.currentIndex + 1
        this.setCurrentIndex(index)
        this.fixPlayingStatus()
      }
      this.songReady = false // songReady 复位
    },

    timeUpdate (evt) {
      this.currentTime = evt.target.currentTime
    },

    // 根据位移得到 percent ，传递出 percent 得到目标时间
    // currentTime 是可读写的属性
    onProgressChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime

      if (!this.playing) {
        this.togglePlaying()
      }

      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },

    endPlay () {
      if (this.mode === playMode.loop) {
        this.loopPlay()
        return
      }

      this.nextSong()
    },

    loopPlay () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()

      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },

    getSongLyric () {
      // getLyric 详见 common/js/normalize-song
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new LyricParser(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play() // play() 是 LyricParser 的实例方法
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },

    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum

      if (lineNum > 5) {
        let lineElement = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineElement, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }

      this.playingLyric = txt
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
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },

    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },

    leave (el, done) {
      this.$refs.cdWrapper.style.transition = `all 0.4s`

      const { x, y, scale } = this._getPositionAndScale()

      // const transform = prefixStyle('transform')
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}, ${y}, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
      done()
    },

    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },

    middleTouchStart (evt) {
      this.touch.initiated = true
      this.touch.startX = evt.touches[0].pageX
      this.touch.startY = evt.touches[0].pageY
    },

    middleTouchMove (evt) {
      if (!this.touch.initiated) return

      const displaceX = evt.touches[0].pageX - this.touch.startX
      const displaceY = evt.touches[0].pageY - this.touch.startY

      // 排除纵向滚动
      if (Math.abs(displaceY) > Math.abs(displaceX)) return

      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + displaceX))

      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

      this.$refs.album.style.opacity = `${1 - this.touch.percent}`
      this.$refs.album.style[transitionDuration] = `0ms`

      this.$refs.lyricList.$el.style[transform] = `translate(${offsetWidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = `0ms`
    },

    middleTouchEnd (evt) {
      let offsetWidth = 0
      let offsetOpacity = 0

      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          offsetOpacity = 0
          this.currentShow = 'lyric'
          this.touch.percent = 1 // touch 容器中的 percent 要处在正确的位置
        } else {
          offsetWidth = 0
          offsetOpacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          offsetOpacity = 1
          this.currentShow = 'cd'
          this.touch.percent = 0 // touch 容器中的 percent 要处在正确的位置
        } else {
          offsetWidth = -window.innerWidth
          offsetOpacity = 0
        }
      }

      const durationTime = 300

      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${durationTime}ms`

      this.$refs.album.style.opacity = `${offsetOpacity}`
      this.$refs.album.style[transitionDuration] = `${durationTime}ms`

      this.touch.initiated = false
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
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },

  filters: {
    formatTime (value) {
      value = value | 0 // 等同于 Math.floor
      const min = value / 60 | 0
      // Number.prototype.toLocaleString() 格式化数字，结果为字符串
      const sec = (value % 60).toLocaleString('zh', { minimumIntegerDigits: 2 })
      return `${min}:${sec}`
    }
  },

  watch: {
    // nextTick 防止报错 DOMException: The play() request was interrupted by a new load request (原因：异步请求)
    currentSong (newSong, oldSong) {
      // 当列表清空时检验 !newSong.id
      if (!newSong.id || newSong.id === oldSong.id) return // 防止暂停时切模式自动播放问题

      if (this.currentLyric) {
        this.currentLyric.stop() // 暂停之前 LyricParser 实例
        console.info('%c Lyric timer has been clean', 'color: dodgerblue')
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this.getSongLyric()
      }, 1000)
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

    playPercent () {
      return this.currentTime / this.currentSong.duration
    },

    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ])
  },

  created () {
    this.touch = {}
  },

  components: {
    BaseProgressBar,
    BaseProgressCircle,
    BaseScroll,
    PartsPlaylist
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
    z-index: 150;
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
      // 使得 .middle-album 与 .middle-lyric 并排排列，即使空间不够
      white-space: nowrap;
      .middle-album {
        display: inline-block;
        position: relative;
        vertical-align: top;
        padding-top: 80%;
        width: 100%;
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
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-ll;
          }
        }
      }
      .middle-lyric {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .lyric-text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
              font-size: $font-size-medium-x;
            }
          }
        }
      }
    }
    .parts-bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        .dot {
          display: inline-block;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 4px;
            background-color: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        margin: 0 auto;
        width: 80%;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
        }
        .time-r {
          text-align: right;
        }
        .progress-bar-wrapper {
          flex: 1;
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
    z-index: 180;
    background-color: $color-highlight-background;
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
      .icon-mini {
        position: absolute; // 相对于 base-progress-circle 中容器元素定位
        top: 0;
        left: 0;
        font-size: 32px;
        color: $color-theme-d;
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
