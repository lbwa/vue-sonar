<template>
  <div class="songs-list">
    <ul>
      <li
        class="list-item"
        v-for="(item, index) of songsData"
        :key="index"
        @click="selectedItem(item, index)"
      >
        <div class="item-rank" v-show="false"></div>
        <div class="item-content">
          <h2 class="item-title">{{ item.name }}</h2>
          <p class="item-description">{{ item.artist }} · {{ item.album }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songsData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  methods: {
    selectedItem (song, index) {
      this.$emit('select', song, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.songs-list {
  padding: 20px 30px;
  .list-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    .item-rank {
      flex: 0 0 25px
    }
    .item-content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .item-title {
        @include ellipsis();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .item-description {
        @include ellipsis();
        margin-top: 4px;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
}

</style>
