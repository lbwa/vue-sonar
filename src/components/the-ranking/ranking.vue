<template>
  <div class="ranking-list" ref="list">
    <BaseScroll class="list-wrapper" :data="topList" ref="scroll">
      <ul>
        <li
          class="ranking-item"
          v-for="(list, listIndex) of topList" :key="listIndex"
          @click="selectList(list)"
        >
          <div class="ranking-icon">
            <img v-lazy="list.picUrl" width="100" height="100" alt="ranking-icon">
          </div>

          <ul class="ranking-info">
            <li
              class="info-song"
              v-for="(song, songIndex) of list.songList"
              :key="songIndex"
            >
              <span>{{ songIndex + 1 }}</span>
              <span>{{ song.songname }} - {{ song.singername }}</span>
            </li>
          </ul>

        </li>
      </ul>
      <BaseLoading v-show="topList.length === 0"/>
    </BaseScroll>
    <router-view/>
  </div>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import BaseLoading from 'base/base-loading/base-loading'
import { getRankingList } from 'api/the-ranking'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },

  methods: {
    selectList (list) {
      this.selectedTopList(list)
      this.$router.push({ path: `/ranking/${list.id}` })
    },

    handlePlaylist (playlist) {
      const bottom = this.playlist.length > 0 ? '60px' : ''

      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    },

    ...mapMutations({
      selectedTopList: 'SET_SELECTED_TOPLIST'
    }),

    _getRankingList () {
      getRankingList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        } else {
          throw new Error('Check ERR_OK failed')
        }
      })
    }
  },

  created () {
    this._getRankingList()
  },

  components: {
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.ranking-list {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  font-size: 0;
  .list-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .ranking-item {
    display: flex;
    padding-top: 20px;
    margin: 0 20px;
    &:last-child {
      padding: 20px 0;
    }
    .ranking-icon {
      flex: 0 0 100px;
      width: 100px;
      height: 100px;
      img {
        width: 100px; // ios safari 不支持行内设置 img 宽高
        height: 100px;
      }
    }
    .ranking-info {
      flex: 1;
      display: flex;
      padding: 0 20px;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      background-color: $color-highlight-background;
      color: $color-text-d;
      font-size: $font-size-small;
      .info-song {
        @include ellipsis();
        line-height: 26px;
      }
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
