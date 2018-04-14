<template>
  <transition name="list-fade">
    <div class="playlist" v-show="hasShowPlaylist" @click="closePlaylist">
      <div class="list-wrapper" @click.stop>

        <div class="list-header">
          <h1 class="title">
            <i :class="['icon', playModeIcon]" @click="togglePlayMode"></i>
            <span class="text">{{ playMode }}</span>
            <span class="clean-playlist" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>

        <BaseScroll class="list-content" :data="playlist">
          <ul>
            <li
              class="content-item"
              v-for="(song, index) of playlist"
              :key="index"
            >
              <i class="current"></i>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

export default {
  data () {
    return {
      hasShowPlaylist: false
    }
  },

  methods: {
    cleanPlaylist () {
      // TODO:
      // this.resetPlayStatus()
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
    },

    closePlaylist () {
      this.hasShowPlaylist = false
    },

    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST'
    }),

    ...mapActions([
      'resetPlayStatus'
    ])
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
