<template>
  <transition name="list-fade">
    <div class="playlist" v-show="hasShowPlaylist" @click.self="closePlaylist">
      <div class="list-wrapper">

        <div class="list-header">
          <h1 class="title">
            <i :class="['icon', playModeIcon]" @click="togglePlayMode"></i>
            <span class="text">{{ playMode }}</span>
            <span class="clean-playlist" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>

        <BaseScroll ref="contentScroll" class="list-content" :data="sequenceList">
          <ul>
            <li
              ref="playlistItem"
              class="content-item"
              v-for="(song, index) of sequenceList"
              :key="index"
              @click="selectSong(song, index)"
            >
              <i :class="['current', getCurrentIcon(song)]"></i>
              <span class="item-text">{{ song.name }}</span>
              <span class="like-btn">
                <i class="icon-not-like"></i>
              </span>
              <span class="delete-btn">
                <i class="icon-close"></i>
              </span>
            </li>
          </ul>
        </BaseScroll>

        <div class="list-operate">
          <div class="add-song">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>

        <div class="list-close" @click="closePlaylist">
          <span>关闭</span>
        </div>

        <BaseConfirm
          ref="confirm"
          title="是否清空所有搜索历史"
          confirmBtnText="清空"
          @confirmSubmit="cleanPlaylist"
        />

      </div>
    </div>
  </transition>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import BaseConfirm from 'base/base-confirm'
import { mapGetters, mapMutations } from 'vuex'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

export default {
  data () {
    return {
      hasShowPlaylist: false
    }
  },

  methods: {
    scrollToCurrentSong (current) {
      const index = this.sequenceList.findIndex(item => {
        return current.id === item.id
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

    cleanPlaylist () {
      // TODO:
    },

    showConfirm () {
      this.$refs.confirm.showConfirm()
    },

    // https://github.com/lbwa/vue-sonar/blob/master/src/components/app-player/app-player.vue#L256-L281
    togglePlayMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList) // 打乱顺序
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },

    resetCurrentIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      }) // 在修改后的 list 中找到当前播放的 index

      this.setCurrentIndex(index)
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

    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  },

  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showPlaylist || newSong.id === oldSong.id) {
        return
      }

      this.scrollToCurrentSong(newSong)
    }
  },

  computed: {
    playModeIcon () {
      return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random'
    },

    playMode () {
      return this.mode === 0 ? '列表循环' : this.mode === 1 ? '单曲循环' : '随机播放'
    },

    ...mapGetters([
      'playlist',
      'mode',
      'sequenceList',
      'currentSong'
    ])
  },

  components: {
    BaseScroll,
    BaseConfirm
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
