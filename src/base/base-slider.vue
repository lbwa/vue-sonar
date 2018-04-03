<template>
  <div class="slider">
    <ul
    class="slider-group"
    @touchstart="startTouch($event)"
    @touchmove="touching($event)"
    @touchend="endTouch($event)"
    :style="sliderTransform"
    >
      <li
        class="slider-item"
        v-for="(item, index) of sliderList"
        :key="index"
      >
        <a :href="item.linkUrl">
          <img :src="item.picUrl" alt="slider-pic">
        </a>
      </li>
    </ul>
    <ul class="slider-dots">
      <li
        v-for="(item, index) of sliderData"
        :key="index"
        :class="['slider-dot', {'active': (currentIndex === index + 1) || (currentIndex === sliderListLength - 1 && index === 0) || (currentIndex === 0 && index === sliderListLength - 3)}]"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    sliderData: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },

  data () {
    return {
      currentIndex: 0, // 显示图像的索引
      innerTimer: 0, // 定时器
      isResetIndex: false, // 是否重置 index
      isTransforming: false, // 是否在过渡中
      transformInterval: 500, // 过渡时长
      startLocation: 0,
      movingLocation: 0
    }
  },

  computed: {
    sliderTransform () {
      return {
        transform: `translateX(${-100 * this.currentIndex}%)`,
        transition: this.isResetIndex ? '' : `transform ${this.transformInterval}ms`
      }
    },
    sliderList () {
      const [firstItem, ...other] = this.sliderData
      // 数组拷贝，防止篡改 props
      return [other[other.length - 1]].concat(this.sliderData, [firstItem])
    },
    sliderListLength () {
      return this.sliderList.length
    }
  },

  methods: {
    startTouch (evt) {
      if (this.currentIndex === -1 || this.currentIndex === this.sliderListLength) {
        return // 触摸时为页首或页末时，返回
      }
      if (evt.target !== evt.currentTarget) {
        clearInterval(this.innerTimer)
        this.isResetIndex = true
        this.startLocation = evt.targetTouches[0].screenX // 因 js 限制， vue 无法监听属性值的变化
      }
    },
    touching (evt) {
      if (evt.target !== evt.currentTarget) {
        this.movingLocation = evt.targetTouches[0].screenX
        let sliderLength = this.movingLocation - this.startLocation

        if (this.currentIndex === 0) { // 若开始轮播时向左滑动
          this.currentIndex = 5
        }

        if (Math.abs(sliderLength) > evt.target.scrollWidth) { // 一次拖动最多只能拖动一张图
          sliderLength = sliderLength < 0 ? -evt.target.scrollWidth : evt.target.scrollWidth
        }

        const targetWidth = parseInt(window.getComputedStyle(evt.target).width)
        const targetLength = -targetWidth * this.currentIndex + sliderLength
        evt.currentTarget.style.transform = `translateX(${targetLength}px)`
      }
    },
    endTouch (evt) {
      if (evt.target !== evt.currentTarget && this.movingLocation && this.currentIndex < this.sliderListLength - 1) {
        const sliderLength = this.movingLocation - this.startLocation
        if (sliderLength < 0) {
          this.currentIndex++
        } else if (sliderLength > 0) {
          this.currentIndex--
        }
        this.startLocation = 0
        this.movingLocation = 0
        this.isResetIndex = false
        this.startSlider()
      }
    },
    startSlider () {
      this.innerTimer = setInterval(() => {
        this.currentIndex++ // 图片轮转由 currentIndex 驱动
      }, this.interval)
    }
  },

  watch: {
    currentIndex (newIndex, oldIndex) {
      if ((newIndex === 1 && oldIndex === (this.sliderListLength - 1)) || (oldIndex === 0 && newIndex === this.sliderListLength - 2)) {
        this.isResetIndex = true // 取消过渡动画，transition 属性
        return
      }

      this.isResetIndex = false
      this.isTransforming = true

      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.currentIndex = this.sliderListLength - 2
        } else if (this.currentIndex === this.sliderListLength - 1) {
          this.currentIndex = 1
        }
        this.isTransforming = false
      }, this.transformInterval) // 在动画结束后切换
    }
  },

  mounted () {
    this.startSlider()
  },

  destroyed () {
    clearInterval(this.innerTimer) // 在组件销毁后清理定时器
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
.slider {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  overflow: hidden;
  font-size: 0;
  .slider-group {
      white-space: nowrap;
    .slider-item {
      display: inline-block;
      width: 100%;
      a {
        display: block;
        height: 100%;
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
  .slider-dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .slider-dot {
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
}
</style>
