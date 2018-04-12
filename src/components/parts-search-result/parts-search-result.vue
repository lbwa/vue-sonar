<template>
  <BaseScroll
    class="search-result-wrapper"
    :data="searchResult" :pullUp="pullUp"
    @scrollToEnd="scrollToEnd"
  >
    <ul class="result-list">
      <li class="result-item" v-for="(item, index) of searchResult" :key="index">
        <div class="item-icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="item-name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </BaseScroll>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import { searchKey } from 'api/the-search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/normalize-song'

const TYPE_SINGER = 'singer'
let timer = 0

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
      pullUp: true
    }
  },

  methods: {
    scrollToEnd () {
      this.page++
      this.search()
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
      searchKey(this.query, this.page, this.showArtist).then(res => {
        if (res.code === ERR_OK) {
          this.searchResult = [...this.searchResult, ...this._normalizeResult(res.data)]
        } else {
          throw new Error('Check ERR_OK failed')
        }
      })
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
    }
  },

  watch: {
    query (newQuery) {
      if (!newQuery) { // 清空输入框时不请求，且初始化组件数据对象
        this.page = 0
        this.searchResult = []
        return
      }

      if (timer) {
        clearTimeout(timer)
        timer = 0
      }
      timer = setTimeout(() => {
        this.search()
      }, 100)
    }
  },

  components: {
    BaseScroll
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.search-result-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
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
}

</style>
