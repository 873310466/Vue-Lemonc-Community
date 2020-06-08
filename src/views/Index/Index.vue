<template>
  <el-row type="flex" justify="space-between" class="row"  id="tabs" >
    <!--左侧文章展示区域-->
    <el-col class="left"  :lg="{span:'15'}" :md="{span:'24'}" :xs="{span:24}">
      <el-tabs type="card" v-model="activeName" ref="tabs" @tab-click="changeTab">
        <!--热门-->
        <el-tab-pane label="热门" name="hottest">
          <Articles v-if="articleData.length!==0" @changePage="changePage" @go2Detail="go2Detail" :page-config="pageConfig"
                    :article-data="articleData"/>
          <div class="not-article" v-else>暂无该文章欸QAQ， <span class="go2Index" @click="go2Index">点击回首页</span></div>
        </el-tab-pane>
        <!--最新-->
        <el-tab-pane label="最新" name="newest">
          <Articles v-if="articleData.length!==0" @changePage="changePage" @go2Detail="go2Detail" :page-config="pageConfig"
                    :article-data="articleData"/>
          <div class="not-article" v-else>暂无该文章欸QAQ， <span class="go2Index" @click="go2Index">点击回首页</span></div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <!--右侧各种-->
    <el-col class="right "   :lg="{span:'8'}" :md="{span:'24'}" :xs="{span:24}">
      <el-card  shadow="hover" >
        <div class="header" >
          <div class="neu-logo" @click="go2NEU" :style="{backgroundImage:`url(${NEULOGO})`}"></div>
        </div>
        <el-carousel >
          <el-carousel-item class="carousel-picture" v-for="(item,i) in carouselPic" :key="i">
            <div class="pic"  :style="{backgroundImage: `url(`+item+`)`}"></div>
          </el-carousel-item>
        </el-carousel>
      </el-card>
      <br>
      <el-tabs class="record-list" :value="actionListName" :stretch="true" type="card" >
        <el-tab-pane label="点赞榜" name="like">
          <div class="item" v-for="(item,i) in likeList" :key="i" @click="go2Personal(item.user.id)">
            <div class="avatar" :style="{backgroundImage: `url(${item.user.avatarUrl})`}"></div>
            <div class="user-info">
              <div class="name">{{item.user.name}}</div>
              <div class="bio">{{item.user.bio}}</div>
              <div class="count">获赞数 : {{countShow(item.count)}}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="阅读榜" name="view">
          <div class="item" v-for="(item,i) in viewList" :key="i" @click="go2Personal(item.user.id)">
            <div class="avatar" :style="{backgroundImage: `url(${item.user.avatarUrl})`}"></div>
            <div class="user-info">
              <div class="name">{{item.user.name}}</div>
              <div class="bio">{{item.user.bio}}</div>
              <div class="count">被阅读次数 : {{countShow(item.count)}}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏榜" name="collection">
          <div class="item" v-for="(item,i) in collectionList" :key="i" @click="go2Personal(item.user.id)">
            <div class="avatar" :style="{backgroundImage: `url(${item.user.avatarUrl})`}"></div>
            <div class="user-info">
              <div class="name">{{item.user.name}}</div>
              <div class="bio">{{item.user.bio}}</div>
              <div class="count">被收藏次数 : {{countShow(item.count)}}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import Articles from '../Article/Articles'
import AESUtil from '../../utils/AESUtil'
import article, { articleData, pageConfig } from '../../assets/js/article'
import { mapMutations } from 'vuex'
import CountUtil from '../../utils/CountUtil'
export default {
  name: 'Index',
  components: { Articles },
  data () {
    return {
      // Tab默认激活
      activeName: 'hottest',
      // 文章数据
      articleData: [],
      // 分页配置
      pageConfig: {
        curPage: 1,
        total: 0,
        isPage: true
      },
      // 东大LOGO
      NEULOGO: require('../../assets/img/NEU_logo.png'),
      // 轮播图
      carouselPic: [
        'http://lemonc.oss-cn-beijing.aliyuncs.com/NEU%E5%9B%BE%E4%B9%A6%E9%A6%86.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905267418&Signature=XiJPKQUQuTjxLimzZOMoxXSc2Pg%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/snow1.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905566723&Signature=F9R9PX8CMpVUd5wfBA%2FJ3F7HYMg%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/snow2.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905566749&Signature=XGUdepab3kuhoikbN6Som%2Fi8syw%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/IMG_20200523_115458.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905589516&Signature=4Sy0hUn05IZ9us%2F2JILIkJVyeEU%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/NEU%E5%A4%9C%E6%99%9A.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905267037&Signature=UENfnDKsuiZbsywLt4GtP14oYhE%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/%E5%B0%8F%E5%8D%97%E6%B9%961.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905566844&Signature=cTP3IUWL54XH5tMxUWiXubTP2cM%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/%E4%B8%80%E5%8F%B7%E6%A5%BC%E8%83%8C%E9%9D%A2.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905589473&Signature=XnNOmL6X4noKLkD58r4odIhr9JM%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/IMG_20180906_200515.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905566434&Signature=ClMVL6zyKlESzueZzaC43O45s9A%3D',
        'http://lemonc.oss-cn-beijing.aliyuncs.com/IMG_20190405_180129.jpg?OSSAccessKeyId=LTAI4FcdfgFbcRQGswy6DgjD&Expires=1905566508&Signature=J7b7O%2BlKL66S3wM4aFv%2BEthSLzE%3D'
      ],
      // 浏览榜数据
      viewList: [],
      // 点赞榜数据
      likeList: [],
      // 收藏榜榜数据
      collectionList: [],
      // 选择看哪个榜单
      actionListName: 'like'
    }
  },
  methods: {
    ...mapMutations(['setArticleId', 'setUserId']),
    // 前往文章详情页面
    go2Detail (id) {
      const aid = AESUtil.encrypt(id)
      this.setArticleId(aid)
      this.$router.push(`/detail?p1=${aid}`)
    },
    // 切换Tab触发事件
    async changeTab (item) {
      article.setArticleType(item.name)
      this.pageConfig.curPage = 1
      switch (item.name) {
        case 'hottest':
          article.setArticleType('hottest')
          await this.getHottestArticles()
          break
        case 'newest':
          article.setArticleType('newest')
          await this.getNewestArticles()
          break
      }
    },
    // 换页触发事件
    changePage (newPage) {
      article.setCurPage(newPage)
      switch (this.activeName) {
        case 'hottest':
          this.getHottestArticles()
          break
        case 'newest':
          this.getNewestArticles()
          break
      }
      document.getElementById('tabs').scrollIntoView()
    },
    // 截取时间字符串
    cutDateTime (time) {
      return time.substr(0, 16)
    },
    // 获取热门文章数据
    async getHottestArticles () {
      await article.getHottestArticles()
      this.articleData = articleData
      this.pageConfig = pageConfig
    },
    // 获取最新文章数据
    async getNewestArticles () {
      await article.getNewestArticles()
      this.articleData = articleData
      this.pageConfig = pageConfig
    },
    // 获取榜单数据
    async getListData () {
      // 点赞表
      const { data: res2 } = await this.$http().get('/public/user/likeList')
      if (res2.code !== 200) return this.$message.warning(res2.label)
      this.likeList = res2.data

      // 浏览榜
      const { data: res1 } = await this.$http().get('/public/user/viewList')
      if (res1.code !== 200) return this.$message.warning(res1.label)
      this.viewList = res1.data

      // 收藏榜
      const { data: res3 } = await this.$http().get('/public/user/collectionList')
      if (res3.code !== 200) return this.$message.warning(res3.label)
      this.collectionList = res3.data
    },
    // 优化数据量展示
    countShow (count) {
      return CountUtil.countShow(count)
    },
    // 点击榜单的人，前往个人中心
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
    },
    // 前往NEU
    go2NEU () {
      window.open('http://www.neu.edu.cn/')
    },
    go2Index () {
      location.reload()
    }
  },
  watch: {},
  created () {
    // 设置搜索的文章标题为undefined
    article.setArticleTitle(undefined)
    // 获取热门文章数据
    this.getHottestArticles()
    // 获取榜单数据
    this.getListData()
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-wrap: wrap;

}

.not-article {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  height: 295px;
  color: #827782;
  .go2Index{
    color: #00aae2;
    cursor: pointer;
  }
  .go2Index:hover{
    border-bottom: 0.5px solid #00aae2;
  }
}

  .el-tabs {
    background-color: #fff;

  }

  .left{
    margin-bottom: 50px;
  }

  .right {
    height: 100%;
    .carousel-picture{
      .pic {
        background: no-repeat;
        background-size: cover;
        border-radius: 2px;
        width: 100%;
        height: 100%;
      }
    }

    .header{
      padding: 24px 20px;
      border-bottom: 1px solid #EBEEF5;
      box-sizing: border-box;
      margin-bottom: 15px;
      position: relative;
    }

    .record-list{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .item {
        padding: 12px 15.6px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: .5s;
        border-bottom: 1px solid #f2f2f3;
        .avatar {
          flex: 0 0 auto;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: .8rem;
          background-size: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          .name{
            width: 225px;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 3px;

          }
          .bio{
            width: 225px;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 3px;
            color: #909090;;
          }
          .count{
            font-size: 12px;
            color: #b2bac2;
          }

        }
      }
      .item:hover{
        background-color: #f8f9fa;
      }
      .item:last-child{
        border-bottom: 0;
      }
    }
  }
  .neu-logo {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    background-size: cover;
    width: 130px;
    height: 40px;
  }
</style>
