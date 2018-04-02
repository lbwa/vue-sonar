<template>
<div class="recommend">
  <BaseScroll class="scroll-wrapper" :data="playList">
    <div>
      <!-- 轮播图 -->
      <div class="slider-wrapper"><!-- 仅做 dots 定位的参照物 -->
      <!-- v-if="recommendList.length" 用于在返回数据后再渲染子组件，否则初始化传入初始值空数组，将导致子组件报错 -->
        <BaseSlider v-if="recommendList.length" :sliderData="recommendList" :interval="3000"></BaseSlider>
      </div>
      <!-- 推荐列表 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
            class="recommend-item"
            v-for="(item, index) of playList"
            :key="index"
            @click="showListDetail"
          >
            <div class="item-avatar">
              <!-- vue-lazyLoad 列表图像懒加载 -->
              <img v-lazy="item.imgurl" alt="item-avatar">
            </div>
            <div class="item-content">
              <h2 class="item-name" v-html="item.creator.name"></h2>
              <p class="item-description" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 加载中提示 -->
    <div class="loading-container" v-show="!playList.length">
      <BaseLoading/>
    </div>
  </BaseScroll>
</div>
</template>

<script>
import { getRecommend, getPlayList } from '@/api/the-recommend'
import { ERR_OK } from 'api/config'
import BaseSlider from 'base/base-slider'
import BaseScroll from 'base/base-scroll'
import BaseLoading from 'base/base-loading/base-loading'

export default {
  data () {
    return {
      recommendList: [],
      playList: [],
      hasShowDetail: false
    }
  },

  methods: {
    showListDetail () {
      this.hasShowDetail = !this.hasShowDetail
    },

    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList = res.data.slider
        }
      })
    },

    _getPlayList () {
      getPlayList().then(res => {
        if (res.code === ERR_OK) {
          this.playList = res.data.list
        }
      })
    }

    /**
     * 1.若 .slider-wrapper 不使用 padding 轮播图占位，那么监听 load 事件调用
     *   loadImg 刷新 BaseScroll 组件状态，以重新计算滚动高度
     * 2.给 img 标签添加 @load="loadImg"
     */

    // loadImg () {
    //   if (!this.hasLoadImg) {  // if 保证只执行唯一一次刷新组件函数，只要一张图加载出来即可
    //     this.$refs.basescroll.refresh()
    //     this.hasLoadImg = true
    //   }
    // }
  },

  created () {
    this._getRecommend()
    this._getPlayList()
  },

  components: {
    BaseSlider,
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.recommend {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 0;
  .scroll-wrapper {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative; // dots 定位参照系
      top: 0;
      left: 0;
      padding-top: 40%; // 轮播图占位
    }
    .recommend-list {
      .list-title {
        text-align: center;
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        color: $color-theme;
      }
      .recommend-item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .item-avatar {
          flex: 0 0 60px;
          padding-right: 20px;
          img {
            width: 60px;
            height: 60px;
          }
        }
        .item-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          overflow: hidden;
          line-height: 20px;
          .item-name {
            margin-bottom: $font-size-small-s;
            font-size: $font-size-medium;
            color: $color-text;
          }
          .item-description {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%; // 左上顶点至已定位祖先容器的 50%
    transform: translateY(-50%); // 上移自身高度的 50%
  }
}
</style>
