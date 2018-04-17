<template>
<div class="app-header">
  <div class="icon"></div>
  <div class="text">Sonar Music</div>
  <router-link to="/user" tag="div" class="user-center">
    <i class="icon-mine"></i>
  </router-link>
</div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '~scss/mixin';
@import '~scss/variables';
.app-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin: 6px 9px 0 0;
    width: 30px;
    height: 32px;
    @include bg-img('logo');
    background-size: 30px 30px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
  .user-center {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: inline-block;
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
    }
  }
}

</style>
