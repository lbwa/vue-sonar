<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hideTopTip">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    hideDelay: {
      type: Number,
      default: 2000
    }
  },

  data () {
    return {
      showFlag: false
    }
  },

  methods: {
    showTopTip () {
      this.showFlag = true

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hideTopTip()
      }, this.hideDelay)
    },

    hideTopTip () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.top-tip {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
  background-color: $color-dialog-background;
  &.drop-enter, &.drop-leave-to {
    transform: translateY(-100%);
  }
  &.drop-enter-active, &.drop-leave-active {
    transition: all .3s;
  }
}
</style>
