<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">

      <div class="progress" ref="progress"></div>

      <div
        class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      ><!-- .prevent 修饰符防止浏览器的默认行为 -->
        <div class="progress-btn"></div>
      </div>

    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/control-dom'

const PROGRESS_BTN_WIDTH = 16
const TRANSFORM = prefixStyle('transform')

export default {
  props: {
    currentPercent: {
      type: Number,
      default: 0
    }
  },

  methods: {
    progressClick (evt) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      console.log(rect)
      const offsetWidth = evt.pageX - rect.left

      /**
       * 1. _offset() 本可传入参数 evt.offsetX，offsetX 规定了事件对象与目标节点的
       * padding edge 在 X 轴方向上的偏移量
       * 2. 不使用 offsetX 的原因是，在点击小圆点时，偏移量计算错误
       */

      this._offset(offsetWidth)
      this._triggerPercent()
    },

    progressTouchStart (evt) {
      this.touch.initiated = true
      this.touch.startX = evt.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },

    progressTouchMove (evt) {
      if (!this.touch.initiated) { return }

      // 当前位移
      const displacement = evt.touches[0].pageX - this.touch.startX
      // 总移动长度
      const progressLength = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      const offsetLength = Math.min(progressLength, Math.max(0, this.touch.left + displacement))

      this._offset(offsetLength)
    },

    progressTouchEnd (evt) {
      this.touch.initiated = false
      this._triggerPercent()
    },

    _offset (length) { // 修改当前显示进度的样式
      this.$refs.progress.style.width = `${length}px`
      this.$refs.progressBtn.style[TRANSFORM] = `translateX(${length}px)`
    },

    _triggerPercent () { // 派发事件，修改当前进度
      const progressLength = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      const percent = this.$refs.progress.clientWidth / progressLength

      // 根据位移得到 percent ，传递出 percent 得到目标时间
      this.$emit('percentChange', percent) // 不处理业务逻辑
    }
  },

  watch: {
    currentPercent (newPercent) {
      // 实际中，存在超过 1 的情况
      // this.touch.initiated 排除拖动的情况
      if (newPercent > 1 || newPercent < 0 || this.touch.initiated) { return }

      const progressLength = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      const offsetLength = newPercent * progressLength

      this._offset(offsetLength)
    }
  },

  computed: {
    // 以下为给 .progress 和 .progress-wrapper 添加样式的计算属性

    /**
     * currentProgress 可使用，但与 currentPercent 的 watcher 度量标准不同，watch
     * 减掉了 PROGRESS_BTN_WIDTH，最后歌曲结束时 $refs.progress 有轻微出头
     * 原因：实际操作中，width 百分比 > 1
     */

    // currentProgress () {
    //   return {
    //     width: `${this.currentPercent * 100}%`
    //   }
    // }

    /**
     * https://cn.vuejs.org/v2/api/#ref
     * https://cn.vuejs.org/v2/guide/components.html#子组件引用
     * 1. $refs 本身是作为渲染结果存在的，故在 mounted 之前 $refs 是不存在的，故查询
     * $refs.bar 的宽度只能使用 watcher 时查询。
     * 2. 经试验，computed 属性中的方法是在 created 之后 mounted 之前调用
     */

    // currentBtn () {
    //   const progressLength = this.$refs.bar.clientWidth // 报错
    //   return {
    //     transform: `translateX(${this.currentPercent * progressLength}px)`
    //   }
    // }
  },

  created () {
    this.touch = {} // 不同 touch 事件之间共享数据的容器
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: $color-background-d;
    .progress { // 动态宽度即是当前播放进度
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      top: -13px;
      left: -8px; // 控件半径
      height: 30px;
      width: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>
