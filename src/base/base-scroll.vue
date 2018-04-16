<template>
<div ref="wrapper">
  <slot></slot>
</div>
</template>

<script>
import BetterScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },

    click: {
      type: Boolean,
      default: true
    },

    data: { // 用于跟踪父组件数据对象的变化，即 ajax 是否返回了 slot 插槽中所需的数据，即确定刷新滚动组件的时机
      type: Array,
      default: null
    },

    listenScroll: {
      type: Boolean,
      default: false
    },

    pullUp: { // 是否开启上拉刷新
      type: Boolean,
      default: false
    },

    beforeScroll: { // 用于移动端 input 失焦时机的判断，以在滚动时收起键盘
      type: Boolean,
      default: false
    },

    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) { return }
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let that = this // 若不设置，那么当外部调用时，this 将不是指向本组件
        this.scroll.on('scroll', pos => { // 监听原生滚动事件，派发一个滚动事件
          that.$emit('scroll', pos)
        })
      }

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd') // 派发滚动到达底部事件
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },

    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },

    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    // 代理执行的方法，意在组件外部调用内部方法更新组件状态
    enable () {
      this.scroll && this.scroll.enable()
    },

    disable () {
      this.scroll && this.scroll.disable()
    },

    refresh () {
      this.scroll && this.scroll.refresh()
    }
  },

  watch: {
    data () { // 自身根据 ajax 数据（props 中的 data 属性）返回刷新滚动组件
      // this.$nextTick(() => {
      //   this.refresh()
      // })
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  },

  mounted () {
    this.$nextTick(() => {
      this._initScroll()
    })
  }
}
</script>

<style lang="scss">

</style>
