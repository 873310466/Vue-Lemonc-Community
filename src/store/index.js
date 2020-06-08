import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'
import article from './modules/article'
import collection from './modules/collection'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 是否登录
    isLogin: false,
    // 未读信息数量
    unreadCount: 0
  },
  mutations: {
    // 设置登录状态
    setIsLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    // 设置未读通知的数量
    setUnreadCount (state, count) {
      state.unreadCount = count
    },
    // 减去未读通知的数量
    decrUnreadCount (state, decrCount) {
      state.unreadCount -= decrCount
    },
    // 清空未读通知的数量
    clearUnreadCount (state) {
      state.unreadCount = 0
    }
  },
  actions: {},
  modules: {
    user, article, collection
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})
