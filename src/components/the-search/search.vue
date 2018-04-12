<template>
<div class="search">
  <div class="search-box-wrapper">
    <BaseSearchBox :placeholder="placeholder"/>
  </div>
</div>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import { getHotKey } from 'api/the-search'
import { ERR_OK } from 'api/config'

export default {
  data () {
    return {
      placeholder: '搜索歌曲、歌手'
    }
  },

  methods: {
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data)
        }
      })
    }
  },

  created () {
    this._getHotKey()
  },

  components: {
    BaseSearchBox
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.search {
  .search-box-wrapper {
    margin: 20px;
  }
}
</style>
