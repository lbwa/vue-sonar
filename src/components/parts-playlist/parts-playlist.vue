<template>
  <transition name="list-fade">
    <div class="playlist" v-show="hasShowPlaylist" @click.self="closePlaylist">
      <div class="list-wrapper">

        <div class="list-header">
          <h1 class="title">
            <i :class="['icon', iconMode]" @click="togglePlayMode"></i>
            <span class="text">{{ playModeText }}</span>
            <span class="clean-playlist" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>

        <BaseScroll
          ref="contentScroll"
          class="list-content"
          :data="sequenceList"
          :refreshDelay="refreshScrollDelay"
        >
          <transition-group name="list" tag="ul">
            <!-- li 的 key 值必须是绑定 song.id，若绑定 index 则动画始终出现在列表末端 -->
            <li
              ref="playlistItem"
              class="content-item"
              v-for="(song, index) of sequenceList"
              :key="song.id"
              @click="selectSong(song, index)"
            >
              <i :class="['current', getCurrentIcon(song)]"></i>
              <span class="item-text">{{ song.name }}</span>
              <span class="like-btn" @click.stop="toggleIsFavorite(song)">
                <i :class="getFavoriteIcon(song)"></i>
              </span>
              <span class="delete-btn" @click.stop="deleteSong(song, index)">
                <i class="icon-close"></i>
              </span>
            </li>
          </transition-group>
        </BaseScroll>

        <div class="list-operate">
          <div class="add-song"  @click="showAddToList">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>

        <div class="list-close" @click="closePlaylist">
          <span>关闭</span>
        </div>

        <BaseConfirm
          ref="confirm"
          title="是否清空播放列表"
          confirmBtnText="清空"
          @confirmSubmit="deleteAllSongs"
        />

      </div>

      <PartsAddToList ref="addToList"/>
    </div>
  </transition>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import BaseConfirm from 'base/base-confirm'
import PartsAddToList from 'components/parts-add-to-list/parts-add-to-list'
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data () {
    return {
      hasShowPlaylist: false,
      refreshScrollDelay: 100 // 值大于等于 transition-group 动画的值
    }
  },

  methods: {
    showAddToList () {
      this.$refs.addToList.showComponent()
    },

    deleteAllSongs () {
      this.deleteAllSongsFromList()
      this.closePlaylist()
    },

    deleteSong (song, index) {
      // 传入的 Index 即是展示性列表 sequenceList 中的 Index
      this.deleteSongFromList({song, index})

      if (!this.playlist.length) {
        this.closePlaylist()
      }
    },

    scrollToCurrentSong (current) {
      const index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.contentScroll.scrollToElement(this.$refs.playlistItem[index], 300)
    },

    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },

    selectSong (song, index) {
      // 传入的 Index 即是展示性列表 sequenceList 中的 Index
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(item => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },

    showConfirm () {
      this.$refs.confirm.showConfirm()
    },

    showPlaylist () {
      this.hasShowPlaylist = true
      // 只有在 display 非 none 值之后才是正确的计算元素高度的时机
      setTimeout(() => { // this.$nextTick
        this.$refs.contentScroll.refresh()
        this.scrollToCurrentSong(this.currentSong)
      }, 20)
    },

    closePlaylist () {
      this.hasShowPlaylist = false
    },

    ...mapActions([
      'deleteSongFromList',
      'deleteAllSongsFromList'
    ])
  },

  watch: {
    currentSong (newSong, oldSong) {
      if (!this.hasShowPlaylist || newSong.id === oldSong.id) {
        return
      }

      this.scrollToCurrentSong(newSong)
    }
  },

  computed: {
    playModeText () {
      return this.mode === playMode.sequence ? '列表循环' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },

  components: {
    BaseScroll,
    BaseConfirm,
    PartsAddToList
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';
@import '~scss/mixin';

.playlist {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translateY(100%);
    }
  }
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;
    .list-wrapper {
      transition: all .3s
    }
  }
  .list-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
  }
  .list-header {
    position: relative;
    padding: 20px 30px 10px 20px;
    .title {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
        font-size: 30px;
        color: $color-theme-d;
      }
      .text, .clean-playlist {
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .text {
        flex: 1;
      }
      .clean-playlist {
        @include extend-click();
        position: relative;
      }
    }
  }
  .list-content {
    padding: 0 30px 0 20px;
    max-height: 240px;
    overflow: hidden;
    .content-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      &.list-enter, &.list-leave-to {
        height: 0;
      }
      &.list-enter-active, &.list-leave-active {
        transition: all 0.1s linear;
      }
      .current {
        flex: 0 0 20px;
        width: 20px;
        font-size: $font-size-small;
        color: $color-theme-d;
      }
      .item-text {
        flex: 1;
        @include ellipsis();
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .like-btn, .delete-btn {
        position: relative;
        font-size: $font-size-small;
        color: $color-theme;
        @include extend-click();
      }
      .like-btn {
        margin-right: 15px;
        .icon-like {
          color: $color-sub-theme;
        }
      }
    }
  }
  .list-operate {
    width: 140px;
    margin: 20px auto 30px;
    .add-song {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border: 1px solid $color-text-l;
      border-radius: 100px;
      color: $color-text-l;
      .icon-add {
        margin-right: 5px;
        font-size: $font-size-small-s;
      }
      .text {
        font-size: $font-size-small;
      }
    }
  }
  .list-close {
    height: 50px;
    background-color: $color-background;
    line-height: 50px;
    text-align: center;
    font-size: $font-size-medium-x;
    color: $color-text-l;
  }
}
</style>
