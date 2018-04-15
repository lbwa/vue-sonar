<template>
  <ul class="switches">
    <li
      :class="['switch-item', {active: currentSwitchIndex === index}]"
      v-for="(item, index) of switchOptions" :key="index"
      @click="selectedSwitch(index)"
    >{{ item.name }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    switchOptions: {
      type: Array,
      default () {
        return []
      }
    },

    currentSwitchIndex: {
      type: Number,
      default: 0
    }
  },

  methods: {
    selectedSwitch (index) {
      this.$emit('selectSwitch', index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.switches {
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 240px;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  text-align: center;
  .switch-item {
    flex: 1;
    padding: 8px;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      background-color: $color-highlight-background;
      color: $color-text;
    }
  }
}
</style>
