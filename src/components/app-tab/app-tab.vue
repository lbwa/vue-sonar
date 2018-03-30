<template>
<div class="app-tab">
  <router-link to="/recommend" class="tab-recommend">
    <span class="tab-item">推荐</span>
  </router-link>
  <router-link to="/artist" class="tab-artist">
    <span class="tab-item">歌手</span>
  </router-link>
  <router-link to="/ranking" class="tab-ranking">
    <span class="tab-item">排行</span>
  </router-link>
  <router-link to="/search" class="tab-search">
    <span class="tab-item">搜索</span>
  </router-link>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.app-tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  text-align: center;
  .tab-recommend, .tab-artist, .tab-ranking, .tab-search {
    flex: 1;
    color: $color-text-l;
  }
  .tab-item {
    padding-bottom: 5px;
  }
  .router-link-active {
    color: $color-theme;
    .tab-item {
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>
