<template>
  <div>
    <el-row>
      <!--主要内容-->
      <el-col :lg="{span:'17'}" :md="{span:24}" class="article-detail">
        <div class="article">
          <div class="author-info-block">
            <!--作者头像-->
            <div @click="go2Personal(articleData.user.id)" class="avatar">
              <img :src="articleData.user.avatarUrl?articleData.user.avatarUrl:defaultImg" alt="作者头像">
            </div>
            <!--作者信息-->
            <div class="author-info-box" >
              <div class="author-name" @click="go2Personal(articleData.user.id)">
                {{articleData.user.name}}
              </div>
              <div class="meta-box">
                <time>{{get8Datetime(articleData.createdTime)}}</time>
                <span class="view-counts">阅读 {{articleData.viewCount}}</span>
                <!--编辑按钮-->
                <span v-if="articleData.authorId===userInfo.id">
                  <span style="margin: 0 .5em">·</span>
                  <el-link icon="el-icon-edit" class="btn-edit" @click="go2Edit">编辑</el-link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <h1 class="article-title">{{articleData.title}}</h1>
        <div class="md-content">
          <mavon-editor
            style="padding: 0!important;box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px"
            :toolbarsFlag="false"
            :subfield="false"
            defaultOpen="preview"
            v-model="articleData.detail"
            ref="md"
          />
        </div>
        <!--文章的具体标签-->
        <div class="tag-list-box">
          <div class="tag-list-title">关注下面的标签，发现更多相似文章</div>
          <div class="tag-list">
            <!--标签-->
            <el-tag effect="plain" v-for="(tag,index) in articleData.tagList" :key="index"><i
              style="font-size: 12px;margin-right: 2px" class="iconfont lm-icon-tag1"></i>{{tag.name}}
            </el-tag>
          </div>
        </div>
        <!--评论区-->
        <div class="comment-list-box" ref="comment">
          <div class="title">评论</div>
          <!--用户评论输入区-->
          <div class="comment-form">
            <img v-if="isLogin" :src="userInfo?userInfo.avatarUrl:undefined" class="avatar-box" @click="go2Personal(articleData.user.id)"/>
            <div v-else class="avatar-box" @click="$message.info('评论需要先登录喔OwO~')"><i class="el-icon-user-solid"></i></div>
            <div style="width: 100%" class="form-box">
              <common-form ref="form" :form-label="firstCommentFormLabel" :form="firstCommentForm" @blur="blur"
                           @focus="focus"/>
              <div class="action-box" v-if="firstCommentVisibility">
                <div class="emoji"></div>
                <div class="submit">
                  <span>Ctrl + Enter </span>
                  <el-button :loading="commentBtnLoading" type="primary" size="small"
                             :disabled="!firstCommentForm.content"
                             @click="commentArticle">评论
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <!--评论展示区-->
          <div class="comment-list">
            <div class="item" v-for="(item,i) in comments" :key="i">
              <div class="comment">
                <!--评论者头像-->
                <div class="user-img" @click="go2Personal(item.user.id)">
                  <img :src="item.user.avatarUrl" alt="评论者头像">
                </div>
                <!--评论内容-->
                <div class="content-box comment-divider-line">
                  <div class="meta-box">
                    <!--评论者-->
                    <div class="commentator" @click="go2Personal(articleData.user.id)">
                      {{item.user.name}}
                    </div>
                  </div>
                  <!--评论正文-->
                  <div class="content">
                    {{item.content}}
                  </div>
                  <div class="reply-stat">
                    <!--评论时间-->
                    <time>{{getReplyTime(item.createdTime)}}</time>
                    <div class="action-box">
                      <!--点赞数-->
                      <div class="like" @click="thumbUpC(item)"
                           :style="{color:isThumbUpComment(item.id)}">
                        <i class="iconfont lm-icon-dianzan-off1"></i> <span style="font-size: 14px;">{{item.likeCount>0?item.likeCount:''}}</span>
                      </div>
                      <!--回复数,点击显示评论区域-二级评论-->
                      <div class="comment1">
                        <el-button type="text" style="color: #8a93a0" @click="showSecond(item.id)">
                          <i class="iconfont lm-icon-comment01" style="margin-right: .5em"></i>回复
                        </el-button>
                      </div>

                    </div>

                  </div>
                  <!--二级评论区输入框-->
                  <div class="comment-form reply-form  reply" v-if="secondCommentVisibility===item.id" :id="item.id">
                    <div class="form-box" style="width: 100%">
                      <common-form ref="secForm" :form-label="firstCommentFormLabel" :form="secondCommentForm"
                                   @blur="secBlur"/>
                      <div class="action-box">
                        <div class="emoji"></div>
                        <!--评论按钮-->
                        <div class="submit">
                          <span>Ctrl + Enter</span>
                          <el-button :loading="secCommentBtnLoading"
                                     type="primary"
                                     size="small"
                                     :disabled="!secondCommentForm.content"
                                     @click="commentReply({parentId:item.id,targetId:item.id})">评论
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--二级评论区展示-->
                  <div class="sub-comment-list">
                    <div class="item" v-for="(subItem,subIndex) in item.children" :key="subIndex">
                      <div class="sub-comment">
                        <div class="sub-comment-content-row">
                          <div class="sub-comment-content-box">
                            <div class="sub-user-icon" @click="go2Personal(subItem.user.id)">
                              <img :src="subItem.user.avatarUrl" alt="">
                            </div>
                            <div class="user-content-box">
                              <div class="profile" @click="go2Personal(subItem.user.id)">
                                {{subItem.name}}
                              </div>
                              <div class="content-box">
                                <span> 回复 </span>
                                <el-link class="target" @click="go2Personal(subItem.targetUser.id)">
                                  {{subItem.targetUser.name}}
                                </el-link>
                                <span> : </span>
                                <span class="content">
                                  {{subItem.content}}
                                </span>
                              </div>
                              <div class="sub-comment-stat-box">
                                <time>{{getReplyTime(subItem.createdTime)}}</time>
                                <div class="action-box">
                                  <!--点赞数-->
                                  <div class="like" @click="thumbUpC(subItem)"
                                       :style="{color:isThumbUpComment(subItem.id)}">
                                    <i class="iconfont lm-icon-dianzan-off1"></i> <span style="font-size: 15px;">{{subItem.likeCount>0?subItem.likeCount:''}}</span>
                                  </div>
                                  <!--评论-->
                                  <div class="comment1">
                                    <el-button type="text" style="color: #8a93a0" @click="showThird(subItem.id)">
                                      <i class="iconfont lm-icon-comment01" style="margin-right: .5em"></i>回复
                                    </el-button>
                                  </div>

                                </div>
                              </div>
                              <div class="comment-form reply-form  reply" v-if="thirdCommentVisibility===subItem.id"
                                   :id="subItem.id">
                                <div class="form-box" style="width: 100%">
                                  <common-form ref="thirdForm" :form-label="firstCommentFormLabel"
                                               :form="secondCommentForm"
                                               @blur="thirdBlur"/>
                                  <div class="action-box">
                                    <div class="emoji"></div>
                                    <!--评论按钮-->
                                    <div class="submit">
                                      <span>Ctrl + Enter</span>
                                      <el-button :loading="secCommentBtnLoading" type="primary" size="small"
                                                 :disabled="!secondCommentForm.content"
                                                 @click="commentReply({parentId:item.id,targetId:subItem.id})">评论
                                      </el-button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-col>
      <!--右侧侧边栏-->
      <el-col :lg="{span:6,offset:1}">
        <div class="side-bar">
          <!--关于作者-->
          <div class="right-sidebar">
            <div class="about-head">关于作者</div>
            <div class="about-body">
              <div class="user-item" @click="go2Personal(articleData.user.id)">
                <div class="user-avatar" :style="'background-image: url('+articleData.user.avatarUrl+')'"></div>
                <div class="info-box">
                  <!--名字-->
                  <div class="username">
                    {{articleData.user.name}}
                  </div>
                  <!--简介-->
                  <div class="bio">
                    {{articleData.user.bio}}
                  </div>
                </div>
              </div>
            </div>
            <div class="stat-item">
              <i class="iconfont lm-icon-good"></i>
              <div class="content">
                <span>获得点赞</span>
                <span class="count">{{authorCount.likeCount}}</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="iconfont lm-icon-view1"></i>
              <div class="content">
                <span>文章被阅读</span>
                <span class="count">{{authorCount.viewCount}}</span>
              </div>
            </div>
          </div>
          <!--相关文章-->
          <div class="related-block">
            <div class="block-title">相关文章</div>
            <div class="block-body">
              <div class="item-box"  v-for="(item,i) in articleRelatedList" :key="i" @click="go2Related(item.id)">
                <div class="item-title">
                  {{item.title}}
                </div>
                <div class="item-body">
                  <div class="item-meta">
                    <i class="iconfont lm-icon-good1"></i>
                    <span class="count">{{item.likeCount}}</span>
                  </div>
                  <div class="item-meta">
                    <i class="iconfont lm-icon-comment3"></i>
                    <span class="count">{{item.commentCount}}</span>
                  </div>
                </div>
              </div>
              <div class="not-related" v-if="articleRelatedList.length===0">暂无相关文章~</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--左侧悬浮侧边栏-->
    <div class="left-sidebar">
      <el-badge :value="articleData.likeCount" :type="thumbUpArticleBtn.type" :max="999" class="panel-btn">
        <el-button circle size="medium" @click="thumbUpA"><i :style="{color: thumbUpArticleBtn.color}"
                                                             class="icon iconfont lm-icon-good"/></el-button>
      </el-badge>
      <el-badge :value="articleData.commentCount" :type="articleData.commentCount>0?'primary':'info'" class="panel-btn">
        <el-button circle size="medium" @click="go2Comment"><i :style="{color: articleData.commentCount>0?'#409eff':''}"
                                                               class="icon iconfont lm-icon-comment1"/></el-button>
      </el-badge>
      <el-badge :value="articleData.collectCount" :type="collectArticleBtn.type" :max="999" class="panel-btn">
        <el-button circle size="medium" @click="showCollections"><i class="iconfont lm-icon-shoucang"
                                                                    :style="{color: collectArticleBtn.color}"/>
        </el-button>
      </el-badge>
    </div>

    <!--收藏集弹窗-->
    <el-dialog
      class="collections"
      :title="collectArticleBtn.color===''?'添加到收藏夹':'取消收藏'"
      :visible.sync="collectionDialogVisibility"
      width="22%"
      center>
      <div class="collection-list">
        <div class="item" v-for="(item,i) in userCollection" :key="i">
          <el-checkbox v-model="item.isChecked" @change="checked=>checkCollection(checked,item)">
            <span class="title">{{item.name}}</span>
            <span class="count">{{item.count}}</span>
          </el-checkbox>
        </div>
      </div>

      <div class="add" v-if="collectArticleBtn.color===''">
        <div class="newC" v-if="showAddForm">
          <el-input @focus="showAddFormInput" placeholder="新建收藏夹"></el-input>
        </div>
        <div class="addC" v-else>
          <el-input placeholder="最多输入10个字" v-model="newCollection.name"></el-input>
          <el-button type="primary" :loading="newCollectionBtnLoading" @click="addCollection"
                     :disabled="newCollection.name===''"
          >创建</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="bindArticleCollection"
               :disabled="bindArticleCollectionData.collectionsId.length===0">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapMutations, mapState } from 'vuex'
import CommonForm from '../../../components/CommonForm'
import { handleDate } from '../../../utils/TimeUtils.js'
import AESUtil from '../../../utils/AESUtil'

const REPLY_ARTICLE = 1
const REPLY_COMMENT = '2'

export default {

  name: 'ArticleDetail',
  components: { CommonForm },
  data () {
    return {
      // ====================收藏夹相关=================
      // 展示添加收藏夹
      showAddForm: true,
      // 收藏夹对话框显示
      collectionDialogVisibility: false,
      // 新建收藏夹的数据
      newCollection: {
        name: '',
        userId: '',
        count: 0
      },
      // 新建收藏夹的按钮加载效果
      newCollectionBtnLoading: false,
      // 用户所拥有的收藏夹
      userCollection: [],
      // 收藏夹和文字的联系
      bindArticleCollectionData: {
        // aId: '', 下面会赋值
        collectionsId: []
      },
      // 收藏按钮样式
      collectArticleBtn: {
        type: 'info',
        color: ''
      },
      userHasCollectionCount: 0,

      // 当前文章的ID
      articleId: '',
      // 默认头像
      defaultImg: require('../../../assets/img/logo.jpg'),
      // 主文章数据
      articleData: {
        id: '',
        title: '',
        detail: '',
        viewCount: 0,
        commentCount: 0,
        likeCount: 0,
        collectCount: 0,
        authorId: '',
        createdTime: '',
        user: {
          avatarUrl: '',
          name: '',
          bio: '',
          id: ''
        },
        tagList: []
      },
      // 相关文章数据
      articleRelatedList: [],
      commentBtnLoading: false,
      secCommentBtnLoading: false,
      // 一级评论
      firstCommentForm: {
        content: '',
        type: '',
        articleId: '',
        parentId: 0,
        commentatorId: '',
        user: {
          avatarUrl: '',
          name: ''
        },
        likeCount: 0,
        createdTime: ''

      },
      // 二级评论
      secondCommentForm: {
        content: '',
        type: '',
        parentId: '',
        articleId: '',
        commentatorId: '',
        targetId: '',
        likeCount: 0
      },
      firstCommentFormLabel: [
        {
          label: '',
          ref: 'commentForm',
          prop: 'content',
          placeholder: '输入评论...'
        }
      ],
      // 文章的评论
      comments: [],
      // 点击评论的输入框就会自动显示
      firstCommentVisibility: false,
      secondCommentVisibility: '',
      thirdCommentVisibility: '',
      // 作者个人成就
      authorCount: {
        viewCount: '',
        goodCount: ''
      },
      // 点赞文章记录
      thumbUpArticle: {
        articleId: '',
        userId: '',
        // 用于通知
        receiverId: '',
        articleTitle: ''
      },
      // 收藏文章记录
      collectArticle: {
        articleId: '',
        userId: '',
        // 用于通知
        receiverId: '',
        articleTitle: ''
      },
      // 点赞按钮样式
      thumbUpArticleBtn: {
        type: 'info',
        color: ''
      },

      // 点赞评论记录
      thumbUpComment: {
        commentId: '',
        userId: '',
        articleId: '',
        // 用于通知
        receiverId: '',
        commentContent: ''
      },
      // 用户已点赞过的评论的ID集合，用于判断评论是否都点赞过
      thumbUpCommentIDSet: [],
      thumbUpCommentBtn: {
        color: '',
        cmtId: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setArticleId', 'setUserId']),
    // ======================数据区==========================
    // 获取文章详情
    // 获取文章的内容
    async getArticleDetail () {
      const { data: res } = await this.$http().get(`/public/article/${this.articleId}`)
      if (res.code !== 200) return this.$message.error('文章不存在欸🧐...')
      this.articleData = res.data
      const { data: res1 } = await this.$http().get('/public/article/view_count', {
        params: {
          aid: this.articleId,
          uid: this.articleData.authorId
        }
      })
      if (res1.code === 200) {
        this.articleData.viewCount += 1
      }
      await this.getAchievement(this.articleData.user.id)
    },
    // 获取文章的评论
    async getComments () {
      const { data: res } = await this.$http().get(`/public/comment/${this.articleId}`)
      if (res.code !== 200) return null
      this.comments = res.data.length > 0 ? res.data : []
    },

    // 获取相关文章的数据
    async getRelatedArticle () {
      const { data: res } = await this.$http().get(`/public/article/related/${this.articleId}`)
      if (res.code !== 200) return null
      this.articleRelatedList = res.data
    },
    // 获取用户在该文章下点赞过的评论ID集合
    async getThumbUpCommentIDSet () {
      if (this.isLogin) {
        const { data: res } = await this.$http().get(`/comment_like/${this.articleId}/${this.userInfo.id}`)
        if (res.code !== 200) return null
        this.thumbUpCommentIDSet = res.data
      }
    },
    // 获取作者成就
    async getAchievement (id) {
      const { data: res } = await this.$http().get('/public/user/achievement', {
        params: {
          id: id
        }
      })
      if (res.code !== 200) return this.$message.warning('服务器君可能出差咯呜呜')
      this.authorCount.viewCount = res.data.viewCount
      this.authorCount.likeCount = res.data.likeCount
    },
    // 获取用户所有的收藏夹
    async getUserCollection () {
      const { data: res } = await this.$http().get(`/collection/${this.userInfo.id}`)
      this.userCollection = res.data
    },
    // 获取用户收藏该文章的收藏夹
    async getUserHasCollection () {
      const { data: res } = await this.$http().get('/collection/has', {
        params: {
          aid: this.articleId,
          uid: this.userInfo.id
        }
      })
      res.data.map(item => {
        item.isChecked = true
      })
      this.userCollection = res.data
    },
    // =====================核心功能============================
    // 评论文章
    commentArticle () {
      if (this.isLogin) {
        this.firstCommentForm.type = REPLY_ARTICLE
        this.firstCommentForm.articleId = this.articleId
        this.firstCommentForm.commentatorId = this.userInfo.id

        this.commentBtnLoading = true
        setTimeout(async () => {
          // 访问后端接口
          const { data: res } = await this.$http().post('/comment/', this.firstCommentForm)
          if (res.code === 4000) return this.$message.info('帐号token已过期，请尝试重新登陆')
          if (res.code !== 200) return this.$message.error('服务器去火星出差了欸呜呜QAQ')
          this.commentBtnLoading = false
          this.articleData.commentCount += 1
          this.blur()
          // ·优化· 拼装元素，为了不评论一次就访问一次数据库。
          const newComment = JSON.parse(JSON.stringify(this.firstCommentForm))
          newComment.user.avatarUrl = this.userInfo.avatarUrl
          newComment.user.name = this.userInfo.name
          newComment.createdTime = new Date().getTime()
          newComment.id = res.data
          this.comments.unshift(newComment)
          this.firstCommentForm.content = ''
        }, 250)
      } else {
        this.$message.info('登录之后才可以点评喔~')
        this.firstCommentForm.content = ''
      }
    },
    // 回复评论
    commentReply (params) {
      if (this.isLogin) {
        // 回复评论
        this.secondCommentForm.type = REPLY_COMMENT
        // 回复哪个人的ID
        this.secondCommentForm.targetId = params.targetId
        // 回复的评论的ID
        this.secondCommentForm.parentId = params.parentId
        // 在哪篇文章下的评论
        this.secondCommentForm.articleId = this.articleId
        // 评论者自己的ID
        this.secondCommentForm.commentatorId = this.userInfo.id

        this.secCommentBtnLoading = true
        setTimeout(async () => {
          // 访问后端接口
          const { data: res } = await this.$http().post('/comment/', this.secondCommentForm)
          if (res.code === 4000) return this.$message.info('帐号token已过期，请尝试重新登陆')
          if (res.code !== 200) return this.$message.error('服务器去火星出差了欸呜呜QAQ')
          this.secCommentBtnLoading = false
          this.articleData.commentCount += 1
          await this.getComments()
        }, 250)
      } else {
        this.$message.info('登录之后才可以回复喔~')
      }
    },
    // 点赞文章
    async thumbUpA () {
      if (this.isLogin) {
        this.thumbUpArticle.articleId = this.articleId
        this.thumbUpArticle.userId = this.userInfo.id
        // 以下是为了进行通知所需要的信息
        this.thumbUpArticle.receiverId = this.articleData.authorId
        this.thumbUpArticle.articleTitle = this.articleData.title
        // 如果true说明还是未点赞的状态
        if (this.thumbUpArticleBtn.color === '') {
          const { data: res } = await this.$http().post('/article_like/', this.thumbUpArticle)
          if (res.data === true) {
            this.thumbUpArticleBtn.type = 'success'
            this.thumbUpArticleBtn.color = '#6cbd45'
            this.articleData.likeCount += 1
            this.authorCount.likeCount += 1
          }
        } else {
          const { data: res } = await this.$http().delete('/article_like/',
            {
              data: this.thumbUpArticle
            })
          if (res.data === true) {
            this.thumbUpArticleBtn.color = ''
            this.thumbUpArticleBtn.type = 'info'
            this.articleData.likeCount -= 1
            this.authorCount.likeCount -= 1
          }
        }
      } else {
        this.$message.info('登录之后才可以点赞喔o\'v\'o~')
      }
    },
    // 点赞评论
    async thumbUpC (comment) {
      if (this.isLogin) {
        // 封装数据
        this.thumbUpComment.commentId = comment.id
        this.thumbUpComment.userId = this.userInfo.id
        this.thumbUpComment.articleId = this.articleId
        // 加上用于通知的数据
        this.thumbUpComment.receiverId = comment.commentatorId
        this.thumbUpComment.commentContent = comment.content
        // 如果该commentId 不在我们维持的一个点赞过的评论ID里面，说明未点赞过
        if (!this.isThumbUpComment(comment.id)) {
          const { data: res } = await this.$http().post('/comment_like/', this.thumbUpComment)
          if (res.data === true) {
            comment.likeCount += 1
            this.thumbUpCommentIDSet.push(comment.id)
          }
        } else {
          const { data: res } = await this.$http().delete('/comment_like/',
            {
              data: this.thumbUpComment
            })
          if (res.data === true) {
            comment.likeCount -= 1
            this.thumbUpCommentIDSet.splice(this.thumbUpCommentIDSet.indexOf(comment.id), 1)
          }
        }
      } else {
        this.$message.info('登录之后才可以点赞喔o\'v\'o~')
      }
    },
    // 点击收藏夹里面的checkBox
    checkCollection (isChecked, c) {
      // 此时是要收藏
      if (this.collectArticleBtn.color === '') {
        // 如果是true，表明想要收藏
        if (isChecked) {
          this.bindArticleCollectionData.collectionsId.push(c.id)
          c.count += 1
        } else {
          this.bindArticleCollectionData.collectionsId.splice(this.bindArticleCollectionData.collectionsId.indexOf(c.id), 1)
          c.count -= 1
        }
      } else {
        // 此时是取消收藏
        if (isChecked) {
          this.bindArticleCollectionData.collectionsId.splice(this.bindArticleCollectionData.collectionsId.indexOf(c.id), 1)
          c.count += 1
        } else {
          // 因为此时是取消收藏，所有要把取消收藏的收藏集ID传递过来
          this.bindArticleCollectionData.collectionsId.push(c.id)
          c.count -= 1
        }
      }
    },
    // 把文章[放进/取出]收藏夹里面
    async bindArticleCollection () {
      // 此时要添加
      if (this.collectArticleBtn.color === '') {
        // 文章ID
        this.bindArticleCollectionData.articleId = this.articleId
        // 文章标题，用于通知跳转
        this.bindArticleCollectionData.articleTitle = this.articleData.title
        // 文章作者ID，用于通知作者被收藏了
        this.bindArticleCollectionData.authorId = this.articleData.authorId
        // 当前用户，用于通知
        this.bindArticleCollectionData.userId = this.userInfo.id
        const { data: res } = await this.$http().post('/article_collect/', this.bindArticleCollectionData)
        if (res.code !== 200) return this.$message.error('添加失败~请重试')
        this.$message.success('收藏成功~')
        this.collectArticleBtn.type = 'warning'
        this.collectArticleBtn.color = '#e6a23c'
        this.articleData.collectCount += 1
        this.userHasCollectionCount += this.bindArticleCollectionData.collectionsId.length
      } else {
        // 此时是删除收藏
        // 文章ID
        this.bindArticleCollectionData.articleId = this.articleId
        const { data: res } = await this.$http().delete('/article_collect/a/cancel', { data: this.bindArticleCollectionData })
        if (res.code !== 200) return this.$message.error('取消失败，请重试')
        this.$message.success('取消收藏成功')
        this.userHasCollectionCount -= this.bindArticleCollectionData.collectionsId.length
        if (this.userHasCollectionCount <= 0) {
          this.collectArticleBtn.type = 'info'
          this.collectArticleBtn.color = ''
          this.articleData.collectCount -= 1
          await this.$http().delete('/article_collect/', { params: { aid: this.articleId, uid: this.articleData.authorId } })
        }
      }
      this.collectionDialogVisibility = false
      this.bindArticleCollectionData.collectionsId = []
    },
    // =======================辅助功能========================
    // 判断是否点赞文章
    // 展示收藏夹
    async showCollections () {
      if (this.isLogin) {
        // 如果true说明还是未点赞的状态
        this.collectionDialogVisibility = true
        this.showAddForm = true
        if (this.collectArticleBtn.color === '') {
          await this.getUserCollection()
        } else {
          await this.getUserHasCollection()
        }
      } else {
        this.$message.info('请先登录喔~')
      }
    },
    // 判断是否点赞文章
    async isThumbUpArticle () {
      if (this.isLogin) {
        const { data: res } = await this.$http().get('/article_like/is', {
          params: {
            aid: this.articleId,
            uid: this.userInfo.id
          }
        })
        if (res.data === true) {
          this.thumbUpArticleBtn.type = 'success'
          this.thumbUpArticleBtn.color = '#6cbd45'
        }
      }
    },
    // 判断是否点赞评论
    isThumbUpComment (commentId) {
      if (this.isLogin && this.thumbUpCommentIDSet.indexOf(commentId) !== -1) {
        return '#6cbd45'
      } else {
        return ''
      }
    },
    // 判断是否收藏文章
    async isCollectArticle () {
      if (this.isLogin) {
        const { data: res } = await this.$http().get('/article_collect/is', {
          params: {
            aid: this.articleId,
            uid: this.userInfo.id
          }
        })
        if (res.data > 0) {
          this.collectArticleBtn.type = 'warning'
          this.collectArticleBtn.color = '#e6a23c'
          this.userHasCollectionCount = res.data
        }
      }
    },
    // 新建收藏夹
    addCollection () {
      // 装配数据
      this.newCollection.count = 0
      this.newCollection.userId = this.userInfo.id
      // 模拟延时
      this.newCollectionBtnLoading = true
      setTimeout(async () => {
        const { data: res } = await this.$http().post('/collection/', this.newCollection)
        if (res.code !== 200) return this.$message.error('创建失败，请重试')
        // res.data.isChecked = false
        this.userCollection.push(res.data)

        this.newCollectionBtnLoading = false
        this.$message.success('添加成功')
        // 清空输入框
        this.newCollection.name = ''
      }, 300)
    },

    // 点击评论按钮，跳转到评论区域
    // blur评论输入框
    blur () {
      setTimeout(() => {
        this.firstCommentVisibility = false
      }, 250)
    },
    // 二级评论输入框blur事件
    secBlur () {
      setTimeout(() => {
        this.secondCommentVisibility = 0
      }, 250)
    },
    thirdBlur () {
      setTimeout(() => {
        this.thirdCommentVisibility = 0
      }, 250)
    },
    // =======================页面跳转===============================
    // 前往相关页面
    go2Related (aid) {
      // this.$message.success('asd')
      this.setArticleId(AESUtil.encrypt(aid))
      const r = this.$router.resolve(`/detail?p1=${AESUtil.encrypt(aid)}`)
      window.open(r.href, '_blank')
    },
    // 前往编辑页面
    go2Edit () {
      this.$router.push({
        path: '/publish',
        query: {
          p1: AESUtil.encrypt(this.articleId)
        }
      })
    },
    go2Comment () {
      this.$refs.comment.scrollIntoView()
      this.$refs.form.$refs.commentForm[0].focus()
    },
    // 评论快捷键，模拟组合键触发函数
    keyCodeForEvent (params) {
      const self = this
      let code = 0
      let code2 = 0
      document.onkeydown = function (e) {
        if (self.firstCommentForm.content.length > 0) {
          const evn = e || event
          const key = evn.keyCode || evn.which || evn.charCode
          if (key === 17) {
            code = 1
          }
          if (key === 13) {
            code2 = 1
          }
          if (code === 1 && code2 === 1) {
            self.commentArticle()
            code = 0
            code2 = 0
          }
        }
        if (self.secondCommentForm.content.length > 0) {
          const evn = e || event
          const key = evn.keyCode || evn.which || evn.charCode
          if (key === 17) {
            code = 1
          }
          if (key === 13) {
            code2 = 1
          }
          if (code === 1 && code2 === 1) {
            self.commentReply()
            code = 0
            code2 = 0
          }
        }
      }
      document.onkeyup = function (e) {
        if (e.keyCode === 17) {
          code = 0
        }
        if (e.keyCode === 13) {
          code2 = 0
        }
      }
    },
    // 显示二级评论输出区域
    showSecond (id) {
      if (this.secondCommentVisibility === id) {
        this.secondCommentVisibility = 0
      } else {
        this.secondCommentVisibility = id
        this.$nextTick(() => {
          this.secondCommentForm.content = ''
          this.$refs.secForm[0].$refs.commentForm[0].focus()
        })
      }
    },
    showThird (id) {
      if (this.thirdCommentVisibility === id) {
        this.thirdCommentVisibility = 0
      } else {
        this.thirdCommentVisibility = id
        this.$nextTick(() => {
          this.secondCommentForm.content = ''
          this.$refs.thirdForm[0].$refs.commentForm[0].focus()
        })
      }
    },
    // focus评论输入框
    focus () {
      this.firstCommentVisibility = true
    },
    // 时间处理
    get8Datetime (time) {
      const year = time.substring(0, 4)
      const month = time.substring(5, 7)
      const day = time.substring(8, 10)
      return year + '年' + month + '月' + day + '日'
    },
    // 获取回复时间
    getReplyTime (date) {
      return handleDate(new Date(date).getTime())
    },
    showAddFormInput () {
      this.showAddForm = !this.showAddForm
    },
    // 前往个人中心
    go2Personal (id) {
      const userId = AESUtil.encrypt(id)
      this.setUserId(userId)
      const routeData = this.$router.resolve({
        path: '/personal',
        query: {
          p1: userId
        }
      })
      window.open(routeData.href, '_blank')
    }
  },
  computed: {
    ...mapState({
      articleIdFromStore: state => state.article.articleId,
      userInfo: state => state.user.userInfo,
      isLogin: 'isLogin'
    })
  },
  watch: {
    /*    $route: function (n, o) {
      // 监听路由参数是否变化
      if (n.fullPath !== o.fullPath) {
        const routeData = this.$router.resolve({
          path: `/detail/${n.params.id}`
        })
        window.open(routeData.href, '_blank')
      }
    } */
  },
  created () {
    // 设置该文章的ID
    this.articleId = AESUtil.decrypt(this.articleIdFromStore)
    // 获取文章详情
    this.getArticleDetail()
    // 获取相关文章数据
    this.getRelatedArticle()
    // 评论快捷键
    this.keyCodeForEvent()
    // 获取评论数据
    this.getComments()
    // 判断用户是否点赞过文章
    this.isThumbUpArticle()
    // 获取用户已登录状态下的点赞评论记录
    this.getThumbUpCommentIDSet()
    // 判断用户是否收藏文章
    this.isCollectArticle()
  }
}
</script>

<style lang="scss" scoped>
  .article-detail {
    margin: 0 auto;
    margin-bottom: 1.5rem;
    padding: 0 1.8rem;
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);

    .article {
      margin-bottom: 3rem;
      padding: 1.8rem 0 0;

      .author-info-block {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;

        .avatar {
          cursor: pointer;
          img {
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            margin-right: 1rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
          }
        }

        .author-info-box {
          min-width: 0;
          flex-grow: 1;

          .author-name {
            cursor: pointer;
            display: inline-block;
            max-width: 100%;
            font-size: 1.1rem;
            font-weight: 700;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .meta-box {
            font-size: 0.9rem;
            color: #909090;

            .view-counts {
              margin-left: .5em;
            }

            .btn-edit {
              color: #1264b6;
              cursor: pointer;
            }
          }
        }
      }
    }

    .article-title {
      margin: .67em 0;
      margin-top: -0.4em;
      font-size: 2.1rem;
      font-weight: 700;
      line-height: 1;
      display: flex;
      justify-content: center;
    }

    .md-content div:first-child {

    }

    .tag-list-box {
      margin-bottom: 2rem;
      margin-top: 1.7rem;

      .tag-list-title {
        margin-bottom: 1rem;
        padding: 0 0 0 2rem;
        font-size: 1rem;
        font-weight: 600;
        color: #000;
        border-left: 6px solid #78bb7b;
      }

      .tag-list {
        /deep/ .el-tag {
          height: 24px;
          line-height: 24px;
          margin-right: 5px;
          padding: 0 5px;
        }

        display: flex;
        flex-wrap: wrap;
      }
    }

    /*评论区域*/
    .comment-list-box {
      .title {
        color: #8a9aa9;
        font-size: 18px;
        font-weight: 400;
        text-align: center;
        padding: 1.67rem 0 5px;
      }

      .comment-form {
        margin: 1.333rem 0;
        display: flex;
        position: relative;
        padding: 1rem 1.333rem;
        background-color: #fafbfc;
        border-radius: 3px;
        /*用户自己头像*/
        .avatar-box {
          cursor: pointer;
          display: inline-block;
          position: relative;
          background-position: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #eee;
          flex: 0 0 auto;
          margin: 0 1rem 0 0;
          width: 2.167rem;
          height: 2.167rem;
          border-radius: 50%;
          i{
            font-size: 25px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .form-box {
          .action-box {
            display: flex;
            align-items: center;
            margin: .65rem 0 0;

            .submit {
              flex: 0 0 auto;
              margin-left: auto;

              span {
                color: #c2c2c2;
                margin-right: 8px;
                font-size: 13px;
              }
            }
          }
        }
      }

      .comment-list {
        margin: 0 1.666rem 0 4.85rem;

        .item {
          margin-bottom: 7px;

          .comment {
            display: flex;

            .user-img {
              cursor: pointer;
              img {
                border-radius: 50%;
                height: 2.167rem;
                width: 2.167rem;

                line-height: 33px;
                display: flex;
                align-items: center;
              }
            }
            .content-box:last-child{
              margin-bottom: 0;
            }
            .content-box {
              margin-left: .833rem;
              flex: 1 1 auto;
              border-bottom: 1px solid #f1f1f1;

              .meta-box {
                display: flex;
                align-items: center;
                font-size: 1.083rem;
                line-height: 1.2;
                white-space: nowrap;

                .commentator {
                  cursor: pointer;
                  display: inline;
                  flex: 1 1 auto;
                  width: 0;
                  color: #333;
                  font-size: 13px;
                  font-weight: 400;
                }

              }

              .content {
                margin-top: .45rem;
                font-size: 13px;
                line-height: 1.2rem;
                white-space: pre-wrap;
                word-break: break-all;
                color: #505050;
              }

              .reply-stat {
                display: flex;
                margin: 12px 0;
                font-weight: 400;
                height: 20px;

                time {
                  font-size: 12px;
                  color: #8a9aa9 !important;
                  cursor: default;
                }

                .action-box {
                  flex: 0 0 auto;
                  display: flex;
                  justify-content: space-between;
                  margin-left: auto;
                  min-width: 100px;
                  color: #8a93a0;
                  user-select: none;

                  .like {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                  }

                  .like:hover {
                    color: #7bb9ff;
                  }

                  .comment1:hover {
                    .el-button {
                      color: #7bb9ff !important;
                    }
                  }

                  .comment1 {
                    display: flex;
                    align-items: center;
                    margin-left: .1rem;
                    font-size: 13px;
                    cursor: pointer;
                  }

                  .comment1:hover {
                    color: #7bb9ff;
                  }

                }

              }

              .comment-form.reply {
                margin-top: 1.000rem;
              }

              .comment-form {
                padding: 1rem;
                /*padding-left: 6px!important;*/

                display: flex;
                position: relative;
                background-color: #fafbfc;
                border-radius: 3px;

                .form-box {
                  flex: 1 1 auto;
                  position: relative;
                }
              }

              .sub-comment-list {
                margin: 1rem 0;
                padding: 0 0 0 1rem;
                background-color: #fafbfc;
                border-radius: 3px;

                .sub-comment {
                  position: relative;
                  padding: 1rem 0 0;

                  .sub-comment-content-row {
                    display: flex;
                    align-items: flex-start;

                    .sub-comment-content-box {
                      display: flex;
                      width: 100%;

                      .sub-user-icon {
                        cursor: pointer;
                        display: inline-block;

                        img {
                          border-radius: 50%;
                          height: 2.167rem;
                          width: 2.167rem;

                          line-height: 33px;
                          display: flex;
                          align-items: center;
                        }
                      }

                      .user-content-box {
                        margin-left: .833rem;
                        padding-bottom: 12px;
                        font-size: 1.083rem;
                        color: #17181a;
                        width: 100%;
                        margin-right: 1rem;

                        .profile {
                          cursor: pointer;
                          display: inline;
                          flex: 1 1 auto;
                          width: 0;
                          color: #333;
                          font-size: 13px;
                          font-weight: 400;
                        }

                        .content-box {
                          border-bottom: 0;
                          font-size: 13px;
                          margin-top: .5rem;
                          margin-left: 0px;

                          .target {
                            /deep/ .el-link--inner {
                              padding-bottom: 3px !important;
                              color: #406599;
                            }

                            /deep/ .el-link--inner:hover {
                              color: #409eff;
                            }
                          }

                          .content {
                            white-space: pre-wrap;
                            color: #505050;
                            line-height: 1.833rem;
                          }
                        }

                        .sub-comment-stat-box {
                          height: 20px;

                          display: flex;
                          margin-top: 7px;
                          font-size: 13px;
                          color: #8a93a0;

                          time {
                            line-height: 20px;
                            height: 20px;
                            font-size: 12px;
                            color: #8a9aa9 !important;
                            cursor: default;

                          }

                          .action-box {
                            flex: 0 0 auto;
                            display: flex;
                            justify-content: space-between;
                            margin-left: auto;
                            min-width: 100px;
                            color: #8a93a0;
                            user-select: none;

                            .like {
                              display: flex;
                              align-items: center;
                              cursor: pointer;
                            }

                            .like:hover {
                              color: #7bb9ff;
                            }

                            .comment1:hover {
                              .el-button {
                                color: #7bb9ff !important;
                              }
                            }

                            .comment1 {
                              display: flex;
                              align-items: center;
                              margin-left: .1rem;
                              font-size: 13px;
                              cursor: pointer;
                            }

                            .comment1:hover {
                              color: #7bb9ff;
                            }

                          }
                        }

                        .comment-form.reply {
                          margin-top: 1.000rem;
                        }

                        .comment-form {
                          background-color: #fff;
                          border: 1px solid #f1f1f2;
                          margin-bottom: 0;
                        }
                      }

                    }
                  }
                }

              }
            }

          }
        }
      }
    }

  }

  .collections {
    .collection-list {
      height: 210px;
      overflow: scroll;

      .item {
        margin: 0.7rem 0;

        .title {
          font-size: 15px;
        }

        .count {
          position: absolute;
          right: 10px;
          font-size: 15px;
          background-color: #c4e1c5;
          margin-left: 10px;
          border-radius: 50%;
          padding-left: 5px;
          padding-right: 5px;
        }
      }

      .item:first-child {
        margin-top: 0;
      }

      .item:last-child {
        margin-bottom: 0;
      }
    }

    .add {
      margin-top: 20px;
    }
  }

  .right-sidebar {
    background-color: #fff;
    position: relative;
    margin-bottom: 1.5rem;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);

    .about-head {
      padding: 0.8rem 1.3rem;
      font-size: 1.03rem;
      color: #333;
      border-bottom: 1px solid hsla(0, 0%, 58.8%, .1);
    }

    .about-body {
      .user-item {
        cursor: pointer;
        display: flex;
        padding: 1.3rem;

        .user-avatar {
          flex: 0 0 auto;
          margin-right: 1rem;
          width: 53px;
          height: 53px;
          align-items: center;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          background-position: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #eee;
        }

        .info-box {
          cursor: pointer;

          .username {
            font-weight: 600;
            color: #000;
          }

          .bio {
            margin-top: .7rem;
            font-size: 15px;
            color: #72777b;
            width: 140px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .stat-item {
      margin-bottom: .65rem;
      padding: 0 1.3rem;
      display: flex;

      i {
        display: flex;
        justify-content: center;
        width: 25px;
        height: 25px;
        line-height: 25px;
        background-color: #e1efff;
        border-radius: 50%;
        color: #7bb9ff;
        margin-right: .5em;
      }

      .content {
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #000;

        .count {
          margin: 0 .3em;
          font-weight: 500;
        }
      }
    }

  }

  .right-sidebar .stat-item:last-child {
    padding-bottom: 16px;
  }

  .related-block {
    background-color: #fff;
    position: relative;
    margin-bottom: 1.5rem;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);

    .block-title {
      padding: 1rem 1.3rem;
      font-size: 16.2px;
      color: #333;
      border-bottom: 1px solid hsla(0, 0%, 58.8%, .1);
      cursor: default;
    }

    .block-body {

      .item-box {
        padding: .8rem 1.3rem;
        cursor: pointer;
        color: #909090;
        border-bottom: 1px solid #f2f2f3;

        .item-title {
          font-size: 14.5px;
          color: #333;
        }

        .item-body {
          margin-top: .4rem;

          .item-meta {
            display: inline-block;
            margin-right: 1.5rem;
            color: #c2c2c2;

            .count {
              color: #b2bac2;
              margin-left: .4rem;
              font-size: 13px;
            }
          }
        }
      }

      .item-box:hover{
        background-color: #f8f9fa;
      }

      .not-related{
        display: flex;
        justify-content: center;
        align-items: center;
        color:
          #909399;
        padding: 10px 0;
        cursor: default;
      }

    }

  }

  .left-sidebar {
    position: fixed;
    top: 12rem;
    margin-left: -5.5rem;

    .panel-btn {
      display: flex;
      position: relative;
      margin-bottom: .8rem;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .lm-icon-comment1 {
      padding-top: 2px;
    }

  }
</style>

<style lang="scss">
  .left-sidebar .el-badge__content {
    /*left: -5px;*/
    transform: translateY(-50%) translateX(78%);
  }

  .comment-form {
    .el-form-item {
      margin-bottom: 0 !important;
      width: 100%;
    }
  }

  .panel-btn {
    .el-button:focus {
      background: #FFF;
      color: #606266;
    }
  }

  .collections {
    .el-checkbox {
      display: block;
      font-size: 20px;
    }

    .el-checkbox__inner {
      width: 23px;
      height: 23px;
    }

    .el-checkbox__inner::after {
      height: 15px;
      left: 9px;
    }

    .addC {
      display: flex;

      .el-input__inner {
      }
    }
  }
</style>
