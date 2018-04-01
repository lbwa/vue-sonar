<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="loading-pic">
    <p class="description">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: `正在载入...`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
.loading {
  width: 100%;
  text-align: center;
  font-size: 0;
  .description {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>
