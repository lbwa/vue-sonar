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
    }
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) { return }
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
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
    data () { // 自身根据 ajax 数据返回刷新滚动组件
      this.$nextTick(() => {
        this.refresh()
      })
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
