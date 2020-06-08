<template>
  <div class="personal-board">
    <el-row class="personal-area">
      <!--左上个人简介-->
      <el-col class="left-top" :lg="{span:'15'}" :md="{span:24}">
        <!--用户头像-->
        <div>
          <img :src="personalUserInfo.avatarUrl" class="avatar" alt="">
        </div>
        <!--用户信息-->
        <div class="info-box">
          <el-tooltip :content="personalUserInfo.name" effect="light" placement="top">
            <div class="top"><h1>{{personalUserInfo.name}}</h1></div>
          </el-tooltip>
          <div class="bio">
            <span class="icon iconfont lm-icon-profile"></span>
            <el-tooltip :content="personalUserInfo.bio" effect="light" placement="bottom-start">
              <span class="content">{{personalUserInfo.bio}}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="action-box">
          <el-button type="primary" plain @click="getPersonalInfo" v-if="Number.parseInt(personalId)===userInfo.id">
            编辑个人资料
          </el-button>
        </div>

      </el-col>

      <el-col class="right-top" :lg="{span:'8'}" :md="{span:24}">
        <div class="sticky">
          <div class="achievement">
            个人成就
          </div>
          <div class="achievement-body">
            <div class="stat-item"><span class="icon iconfont lm-icon-good"></span>
              <span class="content">
                获得点赞
                <span class="count">
                  {{count.likeCount}}
                </span>
              </span></div>
            <div class="stat-item">
              <span class="icon iconfont lm-icon-view"></span>
              <span class="content">
                文章被阅读
                <span class="count">
                  {{count.viewCount}}
                </span>
              </span>
            </div>
            <div class="stat-item"><span class="icon iconfont lm-icon-rise"></span>
              <span class="content">
                C力值
                <span class="count">
                  {{Math.round(count.cli*10)/10}}
                </span>
              </span></div>
          </div>
        </div>

      </el-col>

    </el-row>
    <el-row class="personal-area">
      <el-col id="lb" class="left-bottom" :lg="{span:'15'}" :md="{span:24}">
        <!--个人提问、消息区域等等-->
        <div class="list-block">
          <div class="list-header">
            <el-tabs v-model="activeName">
              <!--文章-->
              <el-tab-pane label="文章" name="article">
                <div v-if="articleData.length===0" class="no-data">
                  这里是空的喔，快去写文章叭！
                </div>
                <Articles v-else @changePage="changePage" @go2Detail="go2Detail" :page-config="pageConfig"
                          :article-data="articleData"/>
              </el-tab-pane>
              <!--通知-->
              <el-tab-pane label="通知" name="notification" v-if="Number.parseInt(personalId)===userInfo.id">
                <div v-if="notificationsData.length===0" class="no-data">
                  暂无通知呜呜 ┭┮﹏┭┮
                </div>
                <div class="notification" v-else>
                  <div class="allAction">
                    <el-button-group>
                      <el-tooltip effect="light" content="全部已读" placement="left">
                        <el-button @click="allNotiRead" :disabled="notificationsData.length===0" type="primary"
                                   size="mini" icon="el-icon-document-checked"></el-button>
                      </el-tooltip>
                      <el-tooltip content="全部删除" placement="right">
                        <el-button @click="allNotiRemove" :disabled="notificationsData.length===0" type="danger"
                                   size="mini" icon="el-icon-delete-solid"></el-button>
                      </el-tooltip>
                    </el-button-group>
                  </div>
                  <div class="userNotificationList" v-for="(item,i) in notificationsData" :key="i">
                    <div class="others">
                      <div class="link">
                        <div class="user">
                          <div class="avatar" :style="{backgroundImage: 'url('+item.notifier.avatarUrl+' )'}"
                               @click="go2Notifier(item.notifier.id)"></div>
                          <div class="profile">
                            <div class="name">
                              {{item.notifier.name}}
                              <el-tag :type="item.nstatus===0?'warning':'success'">{{item.nstatus===0?'未读':'已读'}}
                              </el-tag>
                            </div>
                            <div class="time-info">
                              {{item.createdTime}}
                            </div>
                          </div>
                        </div>
                        <div class="delete">
                          <el-popconfirm
                            @onConfirm="confirmDeleteNotice(item)"
                            title="确定删除该通知吗 ?"
                          >
                            <el-button slot="reference" type="text" size="mini"><i class="iconfont lm-icon-delete"
                                                                                   style="font-size: 20px;"></i>
                            </el-button>
                          </el-popconfirm>
                        </div>
                      </div>
                      <div class="n-content" v-if="item.notifyContent!==''">
                        {{item.notifyContent}}
                      </div>
                      <div class="entry">
                        <div class="entry-url">
                          <span class="action">
                            <i :class="matchIcon(item.notifyAction)"></i>{{item.notifyAction}}你的{{item.targetType}}：
                          </span>
                          <div class="url" @click="go2DetailRead(item)">
                            {{item.targetTitle}}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="收藏" name="collection" v-if="Number.parseInt(personalId)===userInfo.id">
                <div v-if="collectionsData.length===0" class="no-data">
                  快去动动小手，收藏好文叭！
                </div>
                <ul class="collection-list" v-else>
                  <li class="item" v-for="(item,i) in collectionsData" :key="i" @click="go2CollectionInside(item.id)">
                    <div class="one-collection">
                      <a class="c-link">
                        <div class="c-block">

                          <!--内容-->
                          <div class="c-content">
                            <div class="title">
                              {{item.name}}
                            </div>
                            <div class="stat">
                              <span class="name">{{userInfo.name}}</span>
                              <span class="count">{{item.count}} 篇文章</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>

      <el-col class="right-bottom" :lg="{span:'8'}" :md="{span:24}">
        <div class="sticky">
          <div class="milestone">
            <br>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in mileStoneData"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

      </el-col>
    </el-row>

    <!--用户编辑个人资料的对话框-->
    <el-dialog width="340px" title="个人资料" :visible.sync="updateUserInfoConfig.visibility">
      <common-form :form="updateUserInfoConfig.formData" :form-label="updateUserInfoConfig.formLabel"
                   :form-rules="updateUserInfoConfig.formRule"/>
      <div slot="footer">
        <el-button @click="updateUserInfoConfig.visibility = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Articles from '../Article/Articles'
import NotificationTypeConst from '../../constant/NotificationTypeConst'
import NotificationActionConst from '../../constant/NotificationActionConst'
import { handleDate } from '../../utils/TimeUtils'
import CommonForm from '../../components/CommonForm'
import AESUtil from '../../utils/AESUtil'

export default {
  name: 'PersonalCenter',
  components: {
    CommonForm,
    Articles
  },
  data () {
    return {
      mileStoneData: [
        {
          content: '柠檬C与你一起见证未来',
          size: 'large',
          icon: 'el-icon-more',
          type: 'primary'
        }],
      // 更新用户信息的设置
      updateUserInfoConfig: {
        // 控制更新用户信息对话框的显隐
        visibility: false,
        // 表单数据
        formData: {
          id: '',
          name: '',
          bio: ''
        },
        // 表单标签
        formLabel: [
          {
            label: '昵称',
            prop: 'name'
          },
          {
            label: '简介',
            prop: 'bio',
            type: 'textarea'
          }
        ],
        formRule: {
          name: [
            {
              required: true,
              message: '请输入您的昵称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 16,
              message: '长度在 2 至 16 位',
              trigger: 'blur'
            }
          ]
        }
      },
      // 用户ID（因为可能需要点击其他人头像进入个人页面）
      personalId: '',
      personalUserInfo: '',
      count: {
        viewCount: '',
        likeCount: '',
        cli: ''
      },
      // Tab激活名字,默认是自己发布的文章界面
      activeName: 'article',
      // 文章数据
      articleData: [],
      // 分页配置
      pageConfig: {
        curPage: 1,
        total: 0
      },
      // 通知数据
      notificationsData: [],
      // 收藏夹数据
      collectionsData: []
    }
  },
  methods: {
    ...mapMutations(['clearUnreadCount', 'decrUnreadCount', 'setCollectionId', 'setUserId', 'setArticleId']),
    // ======================数据区=============================
    // 点击编辑个人资料按钮回显
    getPersonalInfo () {
      this.$router.push('/user/setting')
    },
    // 点击确定更新按钮
    async confirmUpdate () {
      const { data: res } = await this.$http().put('/user/', this.updateUserInfoConfig.formData)
      if (res.code !== 200) return this.$message.warning(res.label)
      this.$message.success('更新成功')
      this.updateUserInfoConfig.visibility = false
      location.reload()
    },
    // 获取个人成就数据
    async getAchievement () {
      const { data: res } = await this.$http().get('/public/user/achievement', {
        params: {
          id: this.personalId
        }
      })
      if (res.code !== 200) return this.$message.warning('服务器君可能出差咯呜呜')
      this.count.viewCount = res.data.viewCount
      this.count.likeCount = res.data.likeCount
      this.count.cli = res.data.cli
    },
    // 获取个人里程碑
    getMileStone () {
    },
    // 获取文章数据
    async getArticles () {
      const { data: res } = await this.$http().get('/public/article/list', {
        params: {
          curPage: this.pageConfig.curPage,
          size: 5,
          id: this.personalId
        }
      })

      if (res.code !== 200) return this.$message.error('获取文章数据失败')
      this.articleData = res.data.records

      this.pageConfig.total = res.data.total
    },
    // 获取通知数据
    async getNotifications () {
      if (this.isLogin) {
        const { data: res } = await this.$http().get(`/notification/${this.userInfo.id}`)
        if (res.code !== 200) return this.$message.error('获取消息通知失败呜呜/(ㄒoㄒ)/~~')
        res.data.map(item => {
          item.notifyAction = this.matchNotifyAction(item.notifyAction)
          item.targetType = this.matchTargetType(item.targetType)
          item.createdTime = this.getNotificationTime(item.createdTime)
          return item
        })
        this.notificationsData = res.data
      }
    },
    // 获取个人收藏夹
    async getCollections () {
      if (this.isLogin) {
        const { data: res } = await this.$http().get(`/collection/${this.personalId}`)
        if (res.code !== 200) return this.$message.warning('获取个人收藏夹失败')
        this.collectionsData = res.data
      }
    },
    // ======================核心功能=============================

    // 换页触发事件
    changePage (newPage) {
      this.pageConfig.curPage = newPage
      this.getArticles()
      document.getElementById('lb').scrollIntoView()
    },
    // ======================辅助功能=============================
    // 截取时间字符串
    cutDateTime (time) {
      return time.substr(0, 16)
    },
    // 获取通知时间
    getNotificationTime (date) {
      return handleDate(new Date(date).getTime())
    },
    // 匹配TargetType
    matchTargetType (targetType) {
      switch (targetType) {
        case NotificationTypeConst.NOTIFY_ARTICLE.type:
          targetType = NotificationTypeConst.NOTIFY_ARTICLE.description
          break
        case NotificationTypeConst.NOTIFY_COMMENT.type:
          targetType = NotificationTypeConst.NOTIFY_COMMENT.description
          break
      }
      return targetType
    },
    // 匹配通知多做
    matchNotifyAction (action) {
      switch (action) {
        case NotificationActionConst.THUMB_UP.action:
          action = NotificationActionConst.THUMB_UP.description
          break
        case NotificationActionConst.REPLY_ARTICLE.action:
          action = NotificationActionConst.REPLY_ARTICLE.description
          break
        case NotificationActionConst.REPLY_COMMENT.action:
          action = NotificationActionConst.REPLY_COMMENT.description
          break
        case NotificationActionConst.COLLECT.action:
          action = NotificationActionConst.COLLECT.description
          break
      }
      return action
    },
    // 匹配activeName
    matchActiveName (type) {
      switch (type) {
        case 'article':
          this.activeName = 'article'
          break
        case 'notification':
          this.activeName = 'notification'
          break
        case 'collection':
          this.activeName = 'collection'
          break
        default:
          this.activeName = 'article'
          break
      }
    },
    // ======================页面跳转=============================
    // 前往文章详情页面
    go2Detail (id) {
      const aid = AESUtil.encrypt(id)
      this.$router.push(`/detail?p1=${aid}`)
    },
    // 从消息页面前往文章页面
    async go2DetailRead (notification) {
      const articleId = AESUtil.encrypt(notification.targetId)
      this.setArticleId(articleId)
      await this.$router.push(`/detail?p1=${articleId}`)
      if (notification.nstatus === 0) {
        const { data: res } = await this.$http().put(`/notification/${notification.id}`)
        if (res.code !== 200) this.$message.error('服务器君出差了欸OvO')
      }
    },
    // 匹配消息通知动作的图标
    matchIcon (action) {
      switch (action) {
        case NotificationActionConst.THUMB_UP.description:
          return 'iconfont lm-icon-good2'
        case NotificationActionConst.COLLECT.description:
          return 'iconfont lm-icon-shoucang1'
        default:
          return 'iconfont lm-icon-comment4'
      }
    },
    // 确认删除消息通知
    async confirmDeleteNotice (notification) {
      const { data: res } = await this.$http().delete(`/notification/${notification.id}`)
      if (res.code !== 200) return this.$message.error('删除失败，请重试')
      this.$message.success('删除成功~')
      this.notificationsData.splice(this.notificationsData.indexOf(notification), 1)
      this.decrUnreadCount(1)
    },
    // 将消息全部设置为已读
    async allNotiRead () {
      const { data: res } = await this.$http().put(`/notification/all/${this.userInfo.id}`)
      if (res.code !== 200) return this.$message.error('操作失败，请重试')
      this.notificationsData.forEach(item => {
        item.nstatus = 1
      })
      this.clearUnreadCount()
    },
    // 删除所有通知
    async allNotiRemove () {
      const res = await this.$confirm('您确定删除全部通知吗 ?', '提示', {
        roundButton: true,
        type: 'warning'
      })
      if (res === 'confirm') {
        this.$message.success('全部消息删除成功~')
        const { data: res } = await this.$http().delete(`/notification/all/${this.userInfo.id}`)
        if (res.code !== 200) return this.$message.error('删除失败，请重试')
        this.notificationsData = []
        this.clearUnreadCount()
      }
    },
    // 获取用户信息
    async getUserInfoById (flag) {
      const { data: res } = await this.$http().get(`/public/user/${this.personalId}`)
      if (res.code !== 200) return this.$message.error(res.label)
      if (flag) {
        // 添加帐号加入时间
        const data =
          {
            content: '加入柠檬C社区',
            timestamp: res.data.createdTime + '',
            size: 'large',
            icon: 'el-icon-check',
            color: '#0bbd87'
          }
        this.mileStoneData.push(data)
        console.log(data)
      }
      // 个人信息
      this.personalUserInfo = res.data
    },
    // 点击消息通知者头像，跳进消息通知者的主页
    go2Notifier (uid) {
      const uidd = AESUtil.encrypt(uid)
      this.setUserId(uidd)
      const routeData = this.$router.resolve({
        path: '/personal',
        query: {
          p1: uidd
        }
      })
      window.open(routeData.href, '_blank')
    },
    go2CollectionInside (id) {
      // 跳转路由打开新窗口
      const cid = AESUtil.encrypt(id)
      this.setCollectionId(cid)
      this.$router.push({
        path: '/collection',
        query: {
          p1: cid
        }
      })
    }

  },
  computed: {
    ...mapState({
      isLogin: 'isLogin',
      userInfo: state => state.user.userInfo,
      userId: state => state.user.userId
    })
  },
  watch: {
    $route: async function (n, o) {
      // 监听路由参数是否变化
      if (n.fullPath !== o.fullPath) {
        if (n.query.p1 !== o.query.p1) {
          // 设置个人页面用户的ID
          this.personalId = AESUtil.decrypt(this.userId)
          await this.getUserInfoById(false)
          await this.getAchievement()
          await this.getArticles()

          // 获取通知
          await this.getNotifications()
          await this.getCollections()
          await this.matchActiveName(this.$route.query.activeType)
        }
        this.activeName = n.query.activeType
      }
    }
  },
  async created () {
    // 设置个人页面用户的ID
    this.personalId = AESUtil.decrypt(this.userId)
    await this.getUserInfoById(true)
    await this.getAchievement()
    await this.getArticles()
    // 获取通知
    await this.getNotifications()
    await this.getCollections()
    await this.matchActiveName(this.$route.query.activeType)
  }
}
</script>

<style lang="scss" scoped>
  /*
  个人中心八块
  */
  // Tab

  .personal-board {
    .personal-area {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .left-top {
        background-color: #fff;
        border-radius: 5px;
        min-width: 0;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
        display: flex;
        padding: 2.5rem;
        /*头像信息*/

        .avatar {
          flex: 0 0 auto;
          margin-right: 2.4rem;
          width: 7.5rem;
          height: 7.5rem;
          background-color: #f9f9f9;
          border-radius: 50%;
          background-size: contain;
        }

        .avatar:hover {
          transform: rotate(666turn);
          transition-delay: 0.5s;
          transition-property: all;
          transition-duration: 59s;
          transition-timing-function: cubic-bezier(.34, 0, .84, 1);
        }

        /*用户简介*/
        .info-box {
          flex: 1 1 auto;
          margin-right: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 12px;
          line-height: normal;

          .top {
            display: flex;
            align-items: center;

            h1 {
              width: 230px;
              margin: 0;
              padding: 0;
              font-size: 2rem;
              font-weight: 600;
              line-height: 1.2;
              color: #000;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }

          .icon {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            margin-right: .6rem;
            height: 1.8rem;
          }

          .bio {
            margin-top: 1rem;
            display: flex;
            align-items: center;

            width: 15rem;

            .content {
              flex: 1 1 auto;
              line-height: 1.5;
              color: #72777b;
              font-size: 1.0rem;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }

        /*编辑个人资料的按钮*/
        .action-box {
          margin-top: 73px;
        }

      }

      .right-top {
        flex: 0 0 auto;
        margin-left: 1rem;
        width: 20rem;
        line-height: 1.31;

        .sticky {
          position: fixed;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
          width: 20rem;
          transition: all .2s;
          margin-bottom: 1rem;

          .milestone {
            position: absolute;
            top: 30px;
          }

          .achievement {
            padding: 1.333rem;
            font-size: 1.333rem;
            font-weight: 600;
            color: #31445b;
            border-bottom: 1px solid rgba(230, 230, 231, .5);
          }

          .achievement-body {
            padding: 1.333rem;

            .stat-item:not(:last-child) {
              margin-bottom: .8rem;

            }

            .stat-item {
              display: flex;
              align-items: center;

              .icon {
                flex: 0 0 auto;
                margin-right: 1.2rem;
                color: #7bb9ff;
              }

              .lm-icon-rise {
                font-size: 18px;
              }

              .content {
                color: #000;

                .count {

                }
              }
            }
          }
        }

      }

      .right-bottom {
        .sticky {
          position: fixed;
          width: 20rem;
          transition: all .2s;
          margin-bottom: 1rem;
          background-color: #ffffff;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
          border-radius: 5px;

        }

        flex: 0 0 auto;
        margin-left: 1.3rem;
        margin-top: 1.15rem;
        width: 20rem;
        line-height: 1.2;
      }

      .left-bottom {
        border-radius: 5px;
        /*个人提问、回复区域等等*/
        .list-block {
          box-shadow: 0 2px 12px 0 #00000010;
          margin-top: 1rem;
          padding: 0.15rem;

          .list-header {
            padding: 0.2rem;
            padding-left: 1rem;
            min-height: 400px;

            position: relative;
            margin: 0;
            background-color: #fff;
            border-radius: .2rem .2rem 0 0;
            border-bottom: 1px solid #ebebeb;
            z-index: 100;
            /*无通知*/
            .no-data {
              display: flex;
              justify-content: center;
              align-items: center;
              color: #dddddd;
              font-size: 40px;
              padding: 120px 0;
            }

            /*有通知*/
            .notification {
              .allAction {
                display: flex;
                justify-content: flex-end;
                margin-right: 23px;
              }

              .userNotificationList {
                padding: 1.3rem;

                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
                position: relative;

                .others {
                  .link {
                    display: flex;
                    flex-direction: row;

                    .user {
                      display: flex;
                      flex-direction: row;

                      .avatar {
                        cursor: pointer;
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        background-size: cover;
                      }

                      .profile {
                        padding: 0 1rem;
                        color: #8a9aa9;

                        .name {
                          color: #2e3135;
                          font-size: 16px;
                          font-weight: 600;
                        }

                        .time-info {
                          font-size: 14px;
                          padding: .4rem 0;
                          display: flex;
                        }
                      }

                    }

                    .delete {
                      position: absolute;
                      right: 20px;
                      padding-top: 0;
                    }

                    .delete:hover {
                      .el-button {
                        color: red;
                      }
                    }

                  }

                  .n-content {
                    color: #17181a;
                    padding: 0 0 .6rem 3.8rem;
                    font-size: 15px;
                  }

                  .entry {
                    padding: 0 0 0 3.5rem;

                    .entry-url {
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      border-radius: 2px;
                      background-color: #f8f8f8;
                      height: 3.25rem;
                      padding: 0 1rem;
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;

                      .action {
                        color: #a1a9b3;
                        font-style: normal;
                        font-size: 14px;
                        padding: 0 .5rem;

                        i {
                          margin-right: 3px;
                        }
                      }

                      .url {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 14px;
                      }

                      .url:hover {
                        color: #007fff;
                        cursor: pointer;
                      }
                    }
                  }
                }
              }
            }

            /*收藏*/
            .collection-list {
              padding: 1rem 1.2rem 0.6rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;

              .item {
                margin-bottom: .8rem;
                width: calc(50% - .4rem);
                height: 9rem;
                box-sizing: border-box;
                cursor: pointer;

                .one-collection {
                  position: relative;
                  height: 100%;
                  width: 100%;

                  a {
                    width: 100%;
                    height: 100%;
                    text-decoration: none;
                  }

                  .c-link {
                    width: 100%;
                    height: 100%;

                    .c-block:hover {
                      background-color: #5be475;
                    }

                    .c-block {
                      transition: ease-in-out .2s;
                      width: 100%;
                      height: 100%;
                      border-radius: 3px;
                      background-color: #409eff;
                      background-image: linear-gradient(hsla(0, 0%, 85.7%, .3), skyblue);
                      /*                      .mask {
                                              position: absolute;
                                              top: 0;
                                              left: 0;
                                              right: 0;
                                              bottom: 0;
                                              width: 100%;
                                              height: 100%;
                                              border-radius: 5px;
                                              transition: all .5s;

                                            }

                                            .mask:hover {
                                              background-color: #ecf5ff;

                                            }*/

                    }

                    .c-content {

                      position: absolute;
                      top: 1rem;
                      left: 1rem;
                      right: 1rem;
                      bottom: 1rem;
                      overflow: hidden;
                      z-index: 1;

                      .title {
                        position: absolute;
                        left: 0;
                        bottom: 2rem;
                        font-size: 18px;
                        font-weight: 500;
                        line-height: 1.4;
                        color: #fff;
                        cursor: pointer;
                      }

                      .stat {
                        position: absolute;
                        bottom: 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        color: #fff;
                        font-size: 13px;

                        .count {
                          margin-left: 10px;
                          font-size: 12px;
                        }
                      }
                    }
                  }

                }
              }
            }

          }

          ul {
            margin: 0;

            li {
              list-style: none;
            }
          }
        }
      }
    }
  }

</style>
<style>
  .list-header .el-tabs__item {
    width: 4.5rem;
    font-size: 1.05rem;
    flex: 0 0 auto;
    padding-left: 0;
    padding-right: 0;
    padding-top: 5px;
    line-height: 30px;
    text-align: center;
  }

  .name .el-tag {
    height: 23px;
    line-height: 23px;
    margin-left: 5px;
  }
</style>
