<template>
  <div class="artist">
    <BaseArtistList :artistData="artistList" @select="selectArtist"></BaseArtistList>
    <router-view/>
  </div>
</template>

<script>
import { getArtistList } from 'api/the-artist'
import { ERR_OK } from 'api/config'
import BaseArtistList from 'base/base-artist-list'
import Artist from 'common/js/normalize-artist'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_ARTIST_LENGTH = 10

export default {
  data () {
    return {
      artistList: []
    }
  },

  methods: {
    _getArtistList () {
      getArtistList().then(res => {
        if (res.code === ERR_OK) {
          this.artistList = this._normalizeArtistList(res.data.list)
        }
      })
    },

    _normalizeArtistList (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_ARTIST_LENGTH) { // 前 10 项加入“热门”标签，但仍参加后续分类
          map.hot.items.push(new Artist({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 将 json 中的所有项根据 Findex 归类
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Artist({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 对象遍历是无序的，故处理 map 为数组使得遍历时有序
      let ret = []
      let hot = []
      let other = [] // 索引为非 hot 和 非字母开头
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        } else {
          val.title = '#' // 将非 hot 和 非字母开头的 title 转换为统一符号'#'
          other.push(val)
        }
      }
      ret.sort((a, b) => {
        // ret 中按首字母 unicode 升序
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return [...hot, ...ret, ...other]
    },

    selectArtist (artist) {
      // path 覆盖 params
      this.$router.push({ path: `/artist/${artist.id}` })
      this.setArtist(artist)
    },

    ...mapMutations({
      setArtist: 'SET_ARTIST' // 将 `this.setArtist()` 映射为 `this.$store.commit('SET_ARTIST')`
    })
  },

  components: {
    BaseArtistList
  },

  created () {
    this._getArtistList()
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.artist {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
