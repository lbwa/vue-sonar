<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="query" class="input-box" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="cleanInputBox"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },

  methods: {
    cleanInputBox () {
      this.query = ''
    }
  },

  created () {
    this.$watch('query', newQuery => {
      this.$emit('queryChange', newQuery)
    })
  },

  data () {
    return {
      query: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.search-box {
  display: flex;
  padding: 0 6px;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  background-color: $color-highlight-background;
  border-radius: 6px;
  color: $color-background;
  .icon-search {
    font-size: 24px;
  }
  .input-box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background-color: transparent;
    border: transparent;
    font-size: $font-size-medium;
    color: $color-text;
  }
  .icon-dismiss {
    font-size: $font-size-large;
  }
}

</style>
