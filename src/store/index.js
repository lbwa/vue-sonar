import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters.js'
import mutations from './mutations'
import * as actions from './actions'
import createLogger from 'vuex/dist/logger' // 每次修改 state ，都会打印新旧 state

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug, // 检测是否是 mutations 修改 state,非法修改将报错。因有性能损失，则不能在生产环境开启
  plugins: debug ? [createLogger()] : []
})
