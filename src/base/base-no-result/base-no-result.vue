<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.no-result {
  text-align: center;
  .no-result-icon {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    @include bg-img('no-result');
    background-size: 50px 50px;
  }
  .no-result-text {
    margin-top: 10px;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}

</style>
