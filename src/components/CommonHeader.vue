<template>
  <div class="header">
    <div class="row">
      <!--Logo区域-->
      <div class="logo-area" @click="go2Index">
        <img class="logo" :src="logo" @click="go2Index" alt="Logo">
        <span class="logo-name">{{logoName}}</span>
      </div>
      <common-form class="search-form" :form-label="searchFormLabel" :form="searchFormData"
                   @searchQuestion="searchQuestion">
      </common-form>

      <div class="action-box">
        <!--发布-->
        <div class="publish">
          <el-button type="primary" @click="clickPublishBtn">
            <i class="iconfont lm-icon-fatie" style="margin:0 5px 0 -5px"></i>随笔
          </el-button>
        </div>

        <!--通知🔔-->
        <div class="notify" v-if="isLogin">
          <el-badge :value="unreadCount>0?unreadCount:''" type="warning">
            <el-button type="text" @click="go2Notify"><i class="iconfont lm-icon-tongzhi"></i>
            </el-button>
          </el-badge>
        </div>
        <div class="login">
          <el-dropdown v-if="isLogin" @command="handleCommand" >
            <el-image :src="userInfo.avatarUrl"></el-image>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="personal"><i class="iconfont lm-icon-personal"></i>我的主页</el-dropdown-item>
              <el-dropdown-item command="notification"><i class="iconfont lm-icon-message"></i>我的通知</el-dropdown-item>
              <el-dropdown-item command="collection"><i class="iconfont lm-icon-shoucang2"></i>我的收藏</el-dropdown-item>
              <el-dropdown-item command="about"><i class="iconfont lm-icon-question"></i>关于本站</el-dropdown-item>
              <el-dropdown-item command="exit" divided><i class="iconfont lm-icon-tuichu"></i>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-else type="text" @click="openLoginDialog">登录</el-button>
        </div>
      </div>

    </div>

    <!--第三方登录对话框-->
    <el-dialog width="300px" title="第三方登录"
               :visible.sync="loginDialogConfig.loginDialogVisible" ref="loginDialog">
      <div class="oauth-box">
        <div class="oauth">
          <div class="oauth-bg">
            <el-button type="text" disabled @click="go2QQ">
              <i style="color: #4a9afd" class="iconfont lm-icon-qq"></i>
            </el-button>
          </div>
          <div class="oauth-bg">
            <el-button type="text" disabled @click="go2Baidu">
              <i style="color: #306cff" class="iconfont lm-icon-baidu"></i>
            </el-button>
          </div>
          <div class="oauth-bg">
            <el-button type="text" @click="go2Gitee">
              <i style="color: indianred" class="iconfont lm-icon-mayun"></i>
            </el-button>
          </div>
          <div class="oauth-bg">
            <el-button type="text" @click="go2Github">
              <i style="color: #666666" class="iconfont lm-icon-github"></i>
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonForm from './CommonForm'
import { mapState, mapMutations } from 'vuex'
import article, { articleData, pageConfig } from '../assets/js/article'
import AESUtil from '../utils/AESUtil'

export default {
  name: 'CommonHeader',
  components: { CommonForm },
  data () {
    return {
      // logo图片
      logo: require('../assets/img/logo.jpg'),
      // 名称
      logoName: '柠檬C',
      // 表单标签
      searchFormLabel: [
        {
          label: '',
          prop: 'keyword',
          placeholder: '搜索...',
          suffixIcon: 'el-icon-search'
        }
      ],
      // 表单数据
      searchFormData: {
        keyword: ''
      },
      // 登录对话框的设置
      loginDialogConfig: {
        loginDialogVisible: false
      }
    }
  },
  methods: {
    // 设置登录状态
    ...mapMutations(['setIsLogin', 'setUnreadCount', 'setUserInfo', 'setUserId']),
    // ======================数据区==========================

    // ======================核心功能区==========================
    // 点击发帖按钮
    clickPublishBtn () {
      if (this.isLogin) {
        this.$router.push({
          path: '/publish',
          query: {
            p1: AESUtil.encrypt(0)
          }
        })
      } else {
        this.$message.info('请先登录喔喔~OwO')
      }
    },

    // 退出登录
    exit () {
      this.searchFormData.keyword = ''
      article.setArticleTitle(undefined)
      window.localStorage.removeItem('token')
      this.setIsLogin(false)
      this.setUserInfo('')
      this.setUnreadCount(0)
      this.$router.push('/')
    },
    // 搜索文章
    async searchQuestion () {
      this.$router.push(`/search?keyword=${this.searchFormData.keyword}`)
      /*      // 设置要搜索的文章标题
      article.setArticleTitle(this.searchFormData.title)
      article.setCurPage(1)
      if (articleTitle) {
        switch (articleType) {
          case 'hottest':
            await article.getHottestArticles()
            break
          case 'newest':
            await article.getNewestArticles()
            break
        }
        const a = this.$parent.$parent.$children[1].$children[0]
        a.articleData = articleData
        a.pageConfig = pageConfig
      } else {
        this.$message.info('请输入您想查询的文章标题')
      } */
    },
    // ======================辅助功能区==========================
    // 点击“登录”按钮,打开登录界面
    openLoginDialog () {
      this.loginDialogConfig.loginDialogVisible = true
    },
    // 头像以及下拉框触发事件
    handleCommand (command) {
      const userId = AESUtil.encrypt(this.userInfo.id)
      this.searchFormData.keyword = ''
      article.setArticleTitle(undefined)
      switch (command) {
        case 'about':
          this.$router.push('/about')
          break
        case 'exit':
          this.exit()
          break
          // 前往个人中心
        case 'personal':
          this.setUserId(userId)
          this.$router.push({
            path: '/personal',
            query: {
              p1: userId,
              activeType: 'article'
            }
          })
          break
        case 'notification':
          this.setUserId(userId)
          this.$router.push({
            path: '/personal',
            query: {
              p1: userId,
              activeType: 'notification'
            }
          })
          break
        case 'collection':
          this.setUserId(userId)
          this.$router.push({
            path: '/personal',
            query: {
              p1: userId,
              activeType: 'collection'
            }
          })
      }
    },
    // ======================页面跳转区==========================

    // 前往消息通知页面
    go2Notify () {
      this.searchFormData.keyword = ''
      article.setArticleTitle(undefined)
      const uid = AESUtil.encrypt(this.userInfo.id)
      this.setUserId(uid)
      this.$router.push({
        path: '/personal',
        query: {
          p1: AESUtil.encrypt(uid),
          activeType: 'notification'
        }
      })
    },
    // 返回首页
    async go2Index () {
      article.setArticleTitle(undefined)
      await article.getHottestArticles()
      const a = this.$parent.$parent.$children[1].$children[0]
      a.articleData = articleData
      a.pageConfig = pageConfig
      this.searchFormData.keyword = ''
      this.$router.push('/')
    },

    // 使用Gitee登录
    async go2Gitee () {
      const { data: res } = await this.$http().get('/oauth/login/gitee')
      if (res.code !== 200) this.$message.error('请稍后再试')
      window.location = res.data
    },
    // 使用Github登录
    async go2Github () {
      const { data: res } = await this.$http().get('/oauth/login/github')
      if (res.code !== 200) this.$message.error('请稍后再试')
      window.location = res.data
    },
    // 使用QQ登录
    async go2QQ () {
      const { data: res } = await this.$http().get('/oauth/login/qq')
      if (res.code !== 200) this.$message.error('请稍后再试')
      window.location = res.data
    },
    // 使用百度登录
    async go2Baidu () {
      const { data: res } = await this.$http().get('/oauth/login/baidu')
      if (res.code !== 200) this.$message.error('请稍后再试')
      window.location = res.data
    }
  },
  computed: {
    ...mapState({
      isLogin: 'isLogin',
      unreadCount: 'unreadCount',
      userInfo: state => state.user.userInfo
    })
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
  .header {
    margin: 0 auto;
    max-width: 960px;

    .row {
      position: relative;
      display: flex;
      align-items: center;
      height: 60px;

      .logo-area {
        position: relative;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;

        height: 62px;

        .logo {
          display: inline-block;
          height: 50px;
          border-radius: 50%;
          transition: all 0.9s ease-in-out;
          margin-right: 5px;
          cursor: pointer;
          position: relative;
        }

        .logo:hover {
          transition: all 0.9s ease-in-out;
          transform: rotate(360deg);
        }

        .logo-name {
          color: #fbc941;
          cursor: pointer;
          margin-bottom: 3px;

        }
      }

      /*搜索快*/
      .search-form {
        height: 60px;
        display: flex;
        align-items: center;
        width: 20%;
        margin-left: 80px;

        /deep/ .el-form-item {
          margin-bottom: 0;
        }
      }

      .action-box{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 60px;
        width: 60%;
      }
      .publish {
      }

      .notify {
        margin-left: 20px;
      }

      .login {
        margin-left: 20px;

        .el-button {
          border-right: 0;
          font-size: 18px !important;
          padding-right: 15px
        }

        .el-image {
          width: 45px;
          height: 45px;
          border-radius: 4px;
          margin-top: 4px;
          margin-left: -1.5px;
        }

      }

    }

    /deep/ .el-input__icon el-icon-search {
      cursor: pointer !important;
    }
  }

  /*第三方登录对话框*/
  .oauth-box {
    margin-top: 1.2rem;
    line-height: 1.9rem;

    .oauth {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 15px;

      .oauth-bg {
        transition: 0.2s;
        width: 45%;
        height: 122px;
        border-radius: 50%;
        background-color: #f4f8fb;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;

        i {
          font-size: 60px;
        }
      }

      .oauth-bg:hover {
        background-color: #eeeeee;
      }
    }
  }
  @media screen and (max-width:600px){ .logo-name { display:none; } }
</style>
<style>
  .notify .el-badge__content {
    transform: translateY(0%) translateX(70%);
  }
  .login  .el-dropdown-menu .el-popper{
    position: absolute!important;
    right: 0!important;
  }
</style>
