<template>
  <transition name="slide">
    <div class="user-center">

      <div class="switch-wrapper">
        <BaseSwitches
          :switchOptions="switchOptions"
          :currentSwitchIndex="switchIndex"
          @selectSwitch="toggleSwitchIndex"
        />
      </div>

      <div class="back-btn" @click.stop="prevPage">
        <i class="icon-back"></i>
      </div>

      <div class="random-play-btn" @click.stop="addAllSongsToList">
        <i class="icon-play"></i>
        <span class="btn-text">随机播放全部</span>
      </div>

      <div class="list-wrapper">
        <BaseScroll class="scroll-wrapper" v-if="switchIndex === 0">
          <div class="favorite-list-wrapper">
            <BaseSongsList
              :songsData="myFavoriteSongs"
              @select="addSongToList"
            />
          </div>
        </BaseScroll>

        <BaseScroll class="scroll-wrapper" v-if="switchIndex === 1">
          <div class="has-played-wrapper">
            <BaseSongsList
              :songsData="playedHistory"
              @select="addSongToList"
            />
          </div>
        </BaseScroll>
      </div>

      <div class="no-result-wrapper" v-if="showNoResult">
        <BaseNoResult title="这里空空如也 ..."/>
      </div>

    </div>
  </transition>
</template>

<script>
import BaseSwitches from 'base/base-switches/base-switches'
import BaseScroll from 'base/base-scroll'
import BaseSongsList from 'base/base-songs-list/base-songs-list'
import BaseNoResult from 'base/base-no-result/base-no-result'
import { mapGetters, mapActions } from 'vuex'
import Song from 'common/js/normalize-song'

export default {
  data () {
    return {
      switchOptions: [{ name: '我喜欢的' }, { name: '最近播放' }],
      switchIndex: 0
    }
  },

  methods: {
    addAllSongsToList () {
      if (this.switchIndex === 0) {

      } else {
        const list = this.playedHistory.map(song => {
          return new Song(song)
        })

        this.randomPlay({ list })
      }
    },

    addSongToList (song, index) {
      // song 是从 localStorage 读取而来，没有 Song 原型上的方法 getLyric
      this.insertSong(new Song(song))
    },

    prevPage () {
      this.$router.back()
    },

    toggleSwitchIndex (index) {
      this.switchIndex = index
    },

    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },

  computed: {
    showNoResult () {
      return (this.switchIndex === 0 && !this.myFavoriteSongs.length) || (this.switchIndex === 1 && !this.playedHistory.length)
    },

    ...mapGetters([
      'playedHistory',
      'myFavoriteSongs'
    ])
  },

  components: {
    BaseSwitches,
    BaseScroll,
    BaseSongsList,
    BaseNoResult
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background-color: $color-background;
  font-size: 0;
  &.slide-enter, &.slide-leave-to {
    transform: translateX(100%);
  }
  &.slide-enter-active, &.slide-leave-active {
    transition: all .1s
  }
  .switch-wrapper {
    margin: 10px 0 30px;
  }
  .back-btn {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: inline-block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .random-play-btn {
    margin: 0 auto;
    padding: 7px 0;
    width: 135px;
    box-sizing: border-box;
    border: 1px solid $color-text-l;
    border-radius: 100px;
    text-align: center;
    color: $color-text-l;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .btn-text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow: hidden;
    }
  }
  .no-result-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }

}
</style>
