<template>
  <BaseScroll :data="artistData" class="scroll-wrapper" ref="list">
    <ul>
      <li
        class="list-group"
        v-for="(group, index) of artistData"
        :key="index"
        ref="group"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="(item, childIndex) of group.items"
            :key="childIndex"
          >
            <!-- 图像懒加载 -->
            <img v-lazy="item.avatar" width="50" height="50" alt="artist-avatar">
            <span class="artist-name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li
          v-for="(item, index) of shortcutList"
          :key="index"
          :data-index="index"
          class="list-shortcut-item"
          @touchstart="onShortcutToTouchStart"
          @touchmove.stop.prevent="onShortcutToTouchMove"
        >
          <span class="list-shortcut-content">{{ item }}</span>
        </li>
      </ul>
    </div>
  </BaseScroll>
</template>

<script>
import BaseScroll from 'base/base-scroll'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 侧边导航单个 li 元素高度

export default {
  props: {
    artistData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  methods: {
    // 得到锚点 index ，调用 better-scroll 方法跳转至锚点
    onShortcutToTouchStart (evt) {
      let anchorIndex = getData(evt.target, 'index') // 得到自定义 data-index 值
      this.touch.y1 = evt.touches[0].pageY // pageY 触摸目标在 HTML 文档中的 Y 坐标
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 计算偏移距离，以至于得到偏移个数，之后调用跳转元素方法，达到 touchmove 滚动 list 的效果
    onShortcutToTouchMove (evt) {
      this.touch.y2 = evt.touches[0].pageY
      let jumpNumber = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0// 触摸偏移
      let anchorIndex = this.touch.anchorIndex + jumpNumber
      this._scrollTo(anchorIndex)
      console.log('running')
    },

    _scrollTo (index) {
      this.$refs.list.scrollToElement(this.$refs.group[index], 0) // 跳转至元素
    }
  },

  created () {
    // vue 在初始化组件时会将 data 和 props 中数据对象添加 getter 和 setter ，从而达到监听数据变化的目的

    // this.touch 并不需要监听观测变化，故在 created 钩子中创建并初始化
    this.touch = {}
  },

  computed: {
    shortcutList () {
      return this.artistData.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },

  components: {
    BaseScroll
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

.scroll-wrapper {
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
  height: 100%; // 取父元素高度
  font-size: 0;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      img {
        border-radius: 50%;
      }
      .artist-name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    text-align: center;
    border-radius: 10px;
    background-color: $color-background-d;
    .list-shortcut-item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
      .list-shortcut-content {
        font-size: $font-size-small;
      }
    }
  }
}
</style>
