<template>
<div class="search">
  <div class="search-box-wrapper">
    <BaseSearchBox
      :placeholder="placeholder" @queryChange="queryChange" ref="searchBox"
    />
  </div>

  <div class="shortcut-wrapper" v-show="!queryKey">
    <div class="shortcut">
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="hot-key-item"
            v-for="(key, index) of hotKey"
            :key="index"
            @click="selectQueryRecord(key.k)"
          >
            <span>{{ key.k }}</span>
          </li>
        </ul>
      </div>

      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear-btn" @click.stop="clearAllHistory">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <BaseSearchList
          :searchData="searchHistory"
          @selectItem="selectQueryRecord"
          @deleteItem="deleteSearchHistory"
        />
      </div>
    </div>
  </div>

  <PartsResult
    @listScrolling="blurInputBox"
    @selectQuery="saveSearchItem"
    :query="queryKey"
    v-show="queryKey"
  />
  <router-view/>
</div>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import BaseSearchList from 'base/base-search-list'
import PartsResult from 'components/parts-search-result/parts-search-result'
import { getHotKey } from 'api/the-search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      placeholder: '搜索歌曲、歌手',
      hotKey: [],
      queryKey: ''
    }
  },

  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },

  methods: {
    saveSearchItem () {
      this.saveSearchHistory(this.queryKey)
    },

    blurInputBox () {
      this.$refs.searchBox.blurInputBar()
    },

    queryChange (query) {
      this.queryKey = query
    },

    selectQueryRecord (item) {
      /**
       * 调用子组件方法传值的优势在于:
       * 1. 不用设置不必要的 props 和 watch
       * 2. 代码量更少
       * 适用于不需要监听的数据传递，注重传递这一行为
       */

      this.$refs.searchBox.setQuery(item)
    },

    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },

    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory', // 自动传入载荷
      'clearAllHistory'
    ])
  },

  created () {
    this._getHotKey()
  },

  components: {
    BaseSearchBox,
    BaseSearchList,
    PartsResult
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.search {
  font-size: 0;
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .hot-key-item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background-color: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        padding: 0 20px;
        color: $color-text-l;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          .text {
            flex: 1;
            text-align: left;
          }
          .clear-btn {
            flex: 1;
            text-align: right;
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
