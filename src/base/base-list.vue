<template>
  <BaseScroll
    :data="artistData"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    class="scroll-wrapper"
    ref="list"
  >
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
            @click="selectItem(item)"
          >
            <!-- 图像懒加载 -->
            <img v-lazy="item.avatar" width="50" height="50" alt="artist-avatar">
            <span class="artist-name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut" v-show="artistData.length">
      <ul>
        <li
          v-for="(item, index) of shortcutList"
          :key="index"
          :data-index="index"
          :class="['list-shortcut-item', currentIndex === index ? 'active' : '']"
          @touchstart="onShortcutToTouchStart"
          @touchmove.stop.prevent="onShortcutToTouchMove"
        >
          <span class="list-shortcut-content">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div
      class="fixed-title"
      v-show="scrollY < 0"
      :style="translateY"
    >
      <h1 class="fixed-title-content">{{ fixedTitle }}</h1>
    </div>

    <BaseLoading v-if="artistData.length === 0"/>
  </BaseScroll>
</template>

<script>
/**
 * 开发时，热刷新本组件将清空 this.listHeight，则每次修改本组件都必须刷新页面才能正确获得 this.listHeight（因为计算 this.listHeight 是由监听 artistData 触发）
 */
import BaseScroll from 'base/base-scroll'
import { getData } from 'common/js/control-dom'
import BaseLoading from 'base/base-loading/base-loading'

const ANCHOR_HEIGHT = 18 // 侧边导航单个 li 元素高度
const TITLE_HEIGHT = 30 // 顶端标题的高度，用于计算差值

export default {
  props: {
    artistData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      scrollY: -1, // 当前滚动 scrollY 值，如同 window.scrollY
      currentIndex: 0, // 当前 title 的 index
      difference: 0 // scrollY 与 i + 1 锚点 y 坐标的差值
    }
  },

  computed: {
    shortcutList () {
      return this.artistData.map(group => {
        return group.title.substr(0, 1) // 返回首字母
      })
    },

    fixedTitle () {
      return this.artistData[this.currentIndex] ? this.artistData[this.currentIndex].title : []
    },

    translateY () {
      if (this.difference && this.difference < TITLE_HEIGHT) {
        return {
          transform: `translateY(${-(TITLE_HEIGHT - this.difference)}px)`
        }
      } else {
        return {}
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
      let jumpNumber = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 触摸偏移。其中设置初始值 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + jumpNumber // anchorIndex 为字符串
      this._scrollTo(anchorIndex)
    },

    scroll (pos) {
      this.scrollY = pos.y
    },

    _scrollTo (index) {
      if (!index && index !== 0) { // 排除 index 为 null
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index] // 效果：点击行为切换 active 类
      this.$refs.list.scrollToElement(this.$refs.group[index], 0) // 调用子组件方法跳转至锚点, 0表示动画时间
    },

    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.group
      let height = 0
      this.listHeight.push(height)

      for (let i = 0; i < list.length; i++) {
        // clientHeight = height + padding - 水平滚动条
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },

    selectItem (item) { // 路由跳转
      this.$emit('select', item)
    }
  },

  watch: {
    artistData () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },

    scrollY (newY) {
      const listHeight = this.listHeight // 开发时，刷新本组件将清空 this.listHeight，则必须刷新页面才能正确获得 this.listHeight

      // 滚动到顶端时，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间部分
      for (let i = 0; i < listHeight.length - 1; i++) {
        let heightStart = listHeight[i]
        let heightEnd = listHeight[i + 1]
        if (-newY >= heightStart && -newY < heightEnd) {
          this.currentIndex = i
          this.difference = this.listHeight[i + 1] - (-newY)
          return
        }
      }
      // 滚动到底部，且 -newY > 最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    }
  },

  created () {
    // vue 在初始化组件时会将 data 和 props 中数据对象添加 getter 和 setter ，从而达到监听数据变化(以更新 DOM)的目的

    // this.touch 并不需要监听观测变化(以更新 DOM)，是组件内部的一个缓存数据的容器，故在 created 钩子中创建并初始化
    this.touch = {} // 滚动坐标容器

    this.listenScroll = true // 传入 base-scroll，是否需要监听滚动

    this.listHeight = [] // 元素高度的存储容器

    this.probeType = 3 // better-scroll 是否节流，节流（值为0）表现为只有 touch 时的滚动才被监听，不会监听手指离开屏幕滑动页面时的滚动
  },

  components: {
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="scss" scoped>
@import '~scss/variables';

%title {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: $font-size-small;
  color: $color-text-l;
  background-color: $color-highlight-background;
}

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
      @extend %title
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
    z-index: 10;
    width: 20px;
    padding: 20px 0;
    text-align: center;
    border-radius: 10px;
    background-color: $color-background-d;
    .list-shortcut-item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      &.active {
        color: $color-theme;
      }
      .list-shortcut-content {
        font-size: $font-size-small;
      }
    }
  }
  .fixed-title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title-content {
      @extend %title
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
