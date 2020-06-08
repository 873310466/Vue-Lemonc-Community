const user = {
  state: {
    userInfo: {},
    // 前往个人中心的ID
    userId: ''
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setUserInfoName (state, name) {
      state.userInfo.name = name
    },
    setUserInfoBio (state, bio) {
      state.userInfo.bio = bio
    },
    setUserInfoEmail (state, email) {
      state.userInfo.email = email
    },

    setUserId (state, userId) {
      state.userId = userId
    }
  }
}
export default user
