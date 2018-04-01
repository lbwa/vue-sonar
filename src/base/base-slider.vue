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
      :class="['slider-dot', currentIndex === index + 1 ? 'active' : '']"></li>
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
    }
  },

  computed: {
    sliderTransform () {
      return {
        transform: `translateX(${-100 * this.currentIndex}vw)`,
        transition: this.isResetIndex ? '' : `transform ${this.transformInterval}ms`
      }
    },
    sliderList () {
      const [firstItem, ...other] = this.sliderData
      // 数组拷贝，防止篡改 props
      return [other[other.length - 1]].concat(this.sliderData, [firstItem])
    },
    sliderLength () {
      return this.sliderList.length
    }
  },

  methods: {
    startSlider () {
      this.innerTimer = setInterval(() => {
        this.currentIndex++  // 图片轮转由 currentIndex 驱动
      }, this.interval)
    }
  },

  watch: {
    currentIndex (newIndex, oldIndex) {
      if ((newIndex === 1 && oldIndex === (this.sliderLength - 1)) || (oldIndex === 0 && newIndex === this.sliderLength - 2)) {
        this.isResetIndex = true  // 取消过渡动画，transition 属性
        return
      }

      this.isResetIndex = false
      this.isTransforming = true

      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.currentIndex = this.sliderLength - 2
        } else if (this.currentIndex === this.sliderLength - 1) {
          this.currentIndex = 1
        }
        this.isTransforming = false
      }, this.transformInterval)
    }
  },

  mounted () {
    this.startSlider()
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
.slider {
  min-width: 100%;
  overflow: hidden;
  .slider-group {
      white-space: nowrap;
    .slider-item {
      position: relative;
      display: inline-block;
      top: 0;
      padding: 0;
      padding-top: 40%;
      width: 100vw;
      a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        img {
          width: 100vw;
        }
      }
    }
  }
}
</style>
