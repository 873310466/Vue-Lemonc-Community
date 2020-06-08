<template>
  <div class="newest" >
    <div class="content-box" v-for="(item,i) in articleData" :key="i" @click="go2Detail(item.id)">
      <div class="header"><img class="icon" :src="item.user.avatarUrl" alt="作者头像"> {{item.user.name}} ·
        发布于 {{cutDateTime(item.createdTime)}} ·
        <!--标签-->
        <el-tag effect="plain" v-for="(tag,index) in item.tagList" :key="index"><i
          style="font-size: 12px;margin-right: 2px" class="iconfont lm-icon-tag1"></i>{{tag.name}}
        </el-tag>
      </div>
      <div class="title-row">
        <div class="title">{{item.title}}</div>
      </div>
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
    <el-pagination
      class="page"
      background
      layout="prev, pager, next"
      :page-size="7"
      :total="pageConfig.total"
      :current-page.sync="pageConfig.curPage"
      @current-change="changePage"
      hide-on-single-page
    >
    </el-pagination>
  </div>
</template>

<script>
import CountUtil from '../../utils/CountUtil'

export default {
  name: 'Newest',
  props: {
    // 父级传来的分页配置信息
    pageConfig: Object,
    // 文章数据
    articleData: Array
  },
  methods: {
    changePage (newPage) {
      this.$emit('changePage', newPage)
    },
    // 截取时间字符串
    cutDateTime (time) {
      return time.substr(0, 16)
    },
    // 进入文章详情页面
    go2Detail (id) {
      this.$emit('go2Detail', id + '')
    },
    // 优化浏览量展示
    countShow (count) {
      return CountUtil.countShow(count)
    }

  }
}
</script>

<style lang="scss" scoped>

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
  .content-box:last-child{
    margin-bottom: 3px;
  }

  .page {
    position: relative;
    margin: 15px 5px 10px 0;
  }
</style>
