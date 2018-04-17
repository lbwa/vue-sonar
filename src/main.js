import 'babel-polyfill' // 必须写在第一位，babel-polyfill 不用引入源码
import 'common/js/hack-next-tick' // 必须在初始化 vue 之前，详情见文件
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'scss/index.scss'

// vConsole is only for dev
/* eslint-disable no-unused-vars */
// import VConsole from 'vconsole' // 修改了默认 console，主要用于实现手机端 console

// const vConsole = process.env.NODE_ENV === 'development' ? new VConsole() : null

fastClick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('@/common/image/default/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
