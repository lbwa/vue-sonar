<template>
<div class="search">
  <div class="search-box-wrapper">
    <BaseSearchBox
      :placeholder="placeholder" @queryChange="queryChange" ref="searchBox"
    />
  </div>

  <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!queryKey">
    <BaseScroll class="shortcut" ref="scroll" :data="scrollDependence">
      <div class="scroll-wrapper">
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
            <span class="clear-btn" @click.stop="showConfirmBtn">
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
    </BaseScroll>
  </div>

  <PartsResult
    @listScrolling="blurInputBox"
    @selectQuery="saveSearchItem"
    ref="resultList"
    :query="queryKey"
    v-show="queryKey"
  />

  <BaseConfirm
    ref="confirm"
    title="是否清空所有搜索历史"
    confirmBtnText="清空"
    @confirmSubmit="clearAllHistory"
  />
  <!-- 可监听 confirmCancel 事件用于统计点击取消的逻辑 -->

  <router-view/>
</div>
</template>

<script>
import BaseSearchBox from 'base/base-search-box'
import BaseSearchList from 'base/base-search-list'
import BaseConfirm from 'base/base-confirm'
import BaseScroll from 'base/base-scroll'
import PartsResult from 'components/parts-search-result/parts-search-result'
import { getHotKey } from 'api/the-search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],

  data () {
    return {
      placeholder: '搜索歌曲、歌手',
      hotKey: [],
      queryKey: ''
    }
  },

  computed: {
    scrollDependence () { // 用于 scroll 的刷新，当两个依赖变化时，重新计算
      return [...this.hotKey, ...this.searchHistory]
    },

    ...mapGetters([
      'searchHistory'
    ])
  },

  methods: {
    handlePlaylist (playlist) {
      const bottom = this.playlist.length > 0 ? '60px' : ''

      this.$refs.shortcutWrapper.style.bottom = bottom // 历史记录页
      this.$refs.resultList.$el.style.bottom = bottom // 搜索结果页
      this.$refs.scroll.refresh()
      this.$refs.resultList.refreshScroll()
    },

    showConfirmBtn () {
      this.$refs.confirm.showConfirm()
    },

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

  watch: {
    /**
     * 1. 解决的问题：添加一条新的搜索结果后（此时页面刚好达到能滚动的位置），从结果页
     * 退回到搜索页面时，不能滚动。
     * 2。 监听 queryKey,此时的 queryKey 是一个从有到无的变化
     */
    queryKey (newQuery) {
      if (!newQuery) {
        // setTimeout 是 this.$nextTick 的另一种实现
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },

  created () {
    this._getHotKey()
  },

  components: {
    BaseSearchBox,
    BaseSearchList,
    BaseConfirm,
    BaseScroll,
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
