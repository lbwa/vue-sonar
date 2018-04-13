<template>
  <div class="search-list">
    <ul>
      <li
        class="search-item"
        v-for="(item, index) of searchData"
        :key="index"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <div class="icon" @click.stop="deleteItem(item)">
          <i class="icon-close"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searchData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  methods: {
    selectItem (item) {
      this.$emit('selectItem', item)
    },

    deleteItem (item) {
      this.$emit('deleteItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.search-item {
  display: flex;
  align-items: center;
  height: 40px;
  overflow: hidden;
  .text {
    flex: 1;
    font-size: $font-size-medium-x;
    @include ellipsis();
  }
  .icon {
    @include extend-click();
    .icon-close {
      font-size: $font-size-small;
      color: $color-text-d;
    }
  }
}

</style>
