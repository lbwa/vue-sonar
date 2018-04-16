<template>
  <BaseScroll
    class="search-result"
    ref="scroll"
    :data="searchResult" :pullUp="pullUp" :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScrolling"
  >
    <ul class="result-list">
      <li
        class="result-item"
        v-for="(item, index) of searchResult"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="item-icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="item-name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <BaseLoading v-show="hasMore" title="加载中..."/>
    </ul>

    <div class="no-result-wrapper" v-show="!hasMore && !searchResult.length">
      <BaseNoResult title="抱歉，暂无搜索结果"/>
    </div>
  </BaseScroll>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import BaseLoading from 'base/base-loading/base-loading'
import BaseNoResult from 'base/base-no-result/base-no-result'
import { searchKey } from 'api/the-search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/normalize-song'
import { mapMutations, mapActions } from 'vuex'
import Artist from 'common/js/normalize-artist'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20 // 每一页的结果总数

export default {
  props: {
    query: {
      type: String,
      default: ''
    },

    showArtist: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      page: 1,
      searchResult: [],
      hasMore: true, // 是否还有数据未请求
      pullUp: true,
      beforeScroll: true // 用于移动端 input 失焦时机的判断，以在滚动时收起键盘
    }
  },

  methods: {
    refreshScroll () {
      this.$refs.scroll.refresh()
    },

    listScrolling () {
      this.$emit('listScrolling')
    },

    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const artist = new Artist({
          id: item.singermid,
          name: item.singername
        })

        this.setArtist(artist)
        this.$router.push({ path: `/search/${artist.id}` })
      } else {
        this.insertSong(item)
      }

      // 保存历史记录并不是本组件的职责
      this.$emit('selectQuery')
    },

    searchMore () {
      if (!this.hasMore) return

      this.page++
      searchKey(this.query, this.page, this.showArtist, PER_PAGE).then(res => {
        if (res.code === ERR_OK) {
          // / 合并 searchResult
          this.searchResult = [...this.searchResult, ...this._normalizeResult(res.data)]
          this._checkMore(res.data)
        } else {
          throw new Error('Check ERR_OK failed')
        }
      })
    },

    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.artist}`
      }
    },

    getIconClass (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },

    search () {
      this.page = 1 // 未清空输入框就再次执行搜索
      this.hasMore = true
      this.$refs.scroll.scrollTo(0, 0)
      searchKey(this.query, this.page, this.showArtist, PER_PAGE).then(res => {
        if (res.code === ERR_OK) {
          // 重置 searchResult
          this.searchResult = this._normalizeResult(res.data)
          this._checkMore(res.data)
        } else {
          throw new Error('Check ERR_OK failed')
        }
      })
    },

    _checkMore (data) {
      const song = data.song

      if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },

    _normalizeResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singermid) {
        ret.push({
          ...data.zhida,
          type: TYPE_SINGER
        })
      }

      if (data.song) {
        ret = [...ret, ...this._normalizeSongs(data.song.list)]
      }

      return ret
    },

    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        if (item.songmid && item.albumid) {
          ret.push(createSong(item))
        }
      })

      return ret
    },

    ...mapMutations({
      setArtist: 'SET_ARTIST'
    }),

    ...mapActions([
      'insertSong'
    ])
  },

  watch: {
    query (newQuery) {
      if (!newQuery) { // 清空输入框时不请求，且初始化组件数据对象
        this.page = 1
        this.searchResult = []
        return
      }

      this.search()
    }
  },

  components: {
    BaseScroll,
    BaseLoading,
    BaseNoResult
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.search-result {
  height: 100%;
  overflow: hidden;
  font-size: 0;
  .result-list {
    padding: 0 30px;
    .result-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .item-icon {
        flex: 0 30px;
        width: 30px;
        .icon-music, .icon-mine {
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
      .item-name {
        flex: 1;
        overflow: hidden;
        .text {
          @include ellipsis();
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-90%);
  }
}

</style>
