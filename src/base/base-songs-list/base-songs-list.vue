<template>
  <div class="songs-list">
    <ul>
      <li
        class="list-item"
        v-for="(item, index) of songsData"
        :key="index"
        @click="selectedItem(item, index)"
      >
        <div class="item-rank" v-if="showRank">
          <span :class="getRank(index)">{{ getRankText(index) }}</span>
        </div>
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
    },

    showRank: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    selectedItem (song, index) {
      this.$emit('select', song, index)
    },

    getRank (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return `text`
      }
    },

    getRankText (index) {
      return index > 2 ? index + 1 : ''
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
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-img('first')
        }
        &.icon1 {
          @include bg-img('second')
        }
        &.icon2 {
          @include bg-img('third')
        }
      }
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
