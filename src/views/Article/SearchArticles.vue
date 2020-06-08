<template>
  <div class="search-list">
    <header>
      <nav class="nav-block">
        <ul class="nav-list">
          <li class="nav-item">
            <el-link :style="time===-1?activeColor:''" @click="searchArticles(-1)">全部</el-link>
          </li>
          <li class="nav-item">
            <el-link :style="time===1?activeColor:''" @click="searchArticles(1)">一天内</el-link>

          </li>
          <li class="nav-item">
            <el-link :style="time===7?activeColor:''" @click="searchArticles(7)">一周内</el-link>
          </li>
          <li class="nav-item">
            <el-link :style="time===90?activeColor:''" @click="searchArticles(90)">三月内</el-link>
          </li>
        </ul>
      </nav>
    </header>

    <div class="search-body" v-if="articleData.length!==0" >
      <div class="content-box" v-for="(item,i) in articleData" :key="i" @click="go2Detail(item.id)" >

        <div class="header"><img class="icon" :src="item.user.avatarUrl" alt="作者头像"> {{item.user.name}} ·
          发布于 {{cutDateTime(item.createdTime)}} ·
          <!--标签-->
          <el-tag effect="plain" v-for="(tag,index) in item.tagList" :key="index"><i
            style="font-size: 12px;margin-right: 2px" class="iconfont lm-icon-tag1"></i>{{tag.name}}
          </el-tag>
        </div>
        <div class="title-row">
          <div class="title" v-html="item.title"></div>
        </div>
        <div class="detail" v-html="item.detail.substring(0,200)"></div>
        <div class="bottom">
          <el-button-group>
            <el-button type="plain" size="mini"><i class="iconfont lm-icon-good"></i> {{item.likeCount}}
            </el-button>
            <el-button type="plain" size="mini"><i class="iconfont lm-icon-comment1"></i> {{item.commentCount}}
            </el-button>
          </el-button-group>
          <span class="view-count">阅读数 : {{countShow(item.viewCount)}}</span>
        </div>
      </div>
    </div>
    <div class="not-article" v-else>暂无相关文章欸QAQ， <span class="go2Index" @click="go2Index">点击回首页</span></div>

  </div>
</template>

<script>

import AESUtil from '../../utils/AESUtil'
import CountUtil from '../../utils/CountUtil'
import { mapMutations } from 'vuex'

export default {
  name: 'SearchArticles',
  data () {
    return {
      time: '',
      title: '',
      activeColor: { color: '#00aae2' },
      articleData: [],
      keyword: '',
      pageConfig: {
        curPage: 1,
        size: 7
      }
    }
  },
  methods: {
    ...mapMutations(['setArticleId']),
    load () {
      console.log(1)
      console.log(2)
    },
    go2Index () {
      this.$router.push('/')
      location.reload()
    },
    // 搜索文章
    async searchArticles (time) {
      this.time = time
      const { data: res } = await this.$http().get('/public/article/search', {
        params: {
          curPage: this.pageConfig.curPage,
          type: time,
          keyword: this.keyword,
          size: '20'
        }
      })
      console.log(res.data)
      this.articleData = res.data
    },
    // 截取时间字符串
    cutDateTime (time) {
      return time.substr(0, 16)
    },
    // 前往文章详情页面
    go2Detail (id) {
      const aid = AESUtil.encrypt(id)
      this.setArticleId(aid)
      this.$router.push(`/detail?p1=${aid}`)
    },
    // 优化数据量展示
    countShow (count) {
      return CountUtil.countShow(count)
    }
  },
  watch: {
    $route: function (n, o) {
      if (n.query.keyword !== o.query.keyword) {
        console.log(true)
        this.keyword = this.$route.query.keyword
        this.searchArticles(-1)
      }
    }
  },
  created () {
    this.keyword = this.$route.query.keyword
    this.searchArticles(-1)
  }
}
</script>

<style lang="scss" scoped>
  .search-list {
    max-width: 733px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    margin: 0 auto;

    .nav-block {
      height: 3.3rem;
      font-size: 1.08rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 1.2rem;
      border-bottom: 1px solid rgba(178, 186, 194, .15);

      .nav-list {
        height: 100%;
        justify-content: center;
        align-items: center;
        display: flex;

        .nav-item {
          padding: 0 .6rem;
        }

        /*        .nav-item::after{
                  width: 100%;
                  height: 17.52px;
                  content: "·";
                  color: #72777b;
                }*/
      }

      ul {
        list-style-type: none;
      }
    }

    .content-box {
      transition: 0.5s ease-in-out;
      margin-bottom: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      flex-direction: column;
      padding: 1.5rem 1.5rem;
      display: flex;
      justify-content: center;
      /*align-items: center;*/
      .header {
        transition: 0.7s ease-in-out;
        position: relative;

        /deep/ .el-tag {
          height: 18px;
          line-height: 18px;
          margin-right: 5px;
          padding: 0 5px;
        }

        .icon {
          position: relative;
          top: 2px;

          width: 14px;
        }

        color: #B2BAC2;
        font-size: 13px;
      }

      .title-row {
        margin: .5rem 0 1rem;

        .title {
          transition: 0.7s ease-in-out;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 1.2;
          color: #2e3135;
        }
      }
      .detail{
        margin-bottom: 20px;
      }

      .bottom {
        .el-button {
          display: flex;
          align-items: center;
          padding: 0.4rem .5rem;
          height: 100%;
          color: #b2bac2;
          font-weight: 700;

          .iconfont {
            font-size: 12px;
          }
        }

        .el-button:hover {
          color: #72b7dd;
        }

        .view-count {
          transition: .5s;
          float: right;
          color: #b2bac2;
          font-size: 12px;
          line-height: 26.62px;
        }

      }
    }

    .content-box:hover {
      cursor: pointer;
      background-color: skyblue;
      transform: translate(50px, 0);

      .header {
        color: #636472;

      }

      .title {
        color: lightyellow;
      }

      .view-count {
        color: black;
        transform: translateX(-45px);
      }
    }

    .content-box:last-child {
      margin-bottom: 3px;
    }

    .not-article {
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      height: 295px;
      color: #827782;

      .go2Index {
        color: #00aae2;
        cursor: pointer;
      }

      .go2Index:hover {
        border-bottom: 0.5px solid #00aae2;
      }
    }

  }
</style>
