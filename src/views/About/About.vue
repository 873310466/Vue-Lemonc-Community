<template>
<!--  <div :style="{backgroundImage: `url(${backgroundImage})`}" class="about-block">-->
  <div  class="about-block">

    <div class="about-card">
      <el-card>
        <div slot="header" style="display: flex;justify-content: space-between">
          <div class="left">
            <div :style="{backgroundImage: `url(${logo})`}" class="logo" ></div>
            <span style="font-size: 25px;margin-left: 6px">关于本站</span>
          </div>
            <el-button style="padding: 3px 0;" type="text" @click="goBack">
              <i  style="font-size: 21px;" class="iconfont lm-icon-tuichu goback"></i>
            </el-button>

        </div>
        <div class="from">
          柠檬C社区是模仿<span @click="go2juejin" class="juejin">掘金社区</span>进行设计和开发的，初衷是为了锻炼自己的开发能力。
          <div class="descr">主要功能</div>
          <ul>
            <li>第三方登录</li>
            <li>发表文章（Markdown格式） & 上传图片</li>
            <li>热门文章 & 最新文章</li>
            <li>相关文章</li>
            <li>文章的简单搜索</li>
            <li>浏览量的并发处理</li>
            <li>点赞、评论（二级评论）、收藏</li>
            <li>消息通知</li>
            <li>排行榜</li>
            <li>······</li>
          </ul>
          <div class="descr">主要技术栈</div>
          <ul>
            <li>后端：Springboot、Mybatis(Mybatis-Plus)、Redis、Oauth、Swagger2 ······</li>
            <li>前端：Vue、Element-UI、Axios、IconFont ······</li>
          </ul>
          <div class="descr">目前状况</div>
          <ul>
            <li>作者：柠檬鱼</li>
            <li>现状：东北大学-大二学生</li>
            <li>联系方式：873310466@qq.com</li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      // logo图片
      logo: require('../../assets/img/logo.jpg')
    }
  },
  methods: {
    goBack () {
      this.$router.push('/')
    },
    go2juejin () {
      window.open('https://juejin.im/timeline')
    }
  }
}
</script>

<style lang="scss" scoped>
  .about-block {
    background-color: skyblue;
    .about-card {

      padding: 50px ;
      margin: 0px auto;
      width: 666px;
      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .logo {
          width: 33px;
          height: 33px;
          background-size: cover;
        }
      }

      .goback:hover{
        color: #78bb7b;
      }
      .from{
        font-size: 17px;
        .juejin{
          color: #00aae2;
          cursor: pointer;
        }
        .juejin:hover{
          border-bottom: #00aae2 .5px solid;
        }
        ul li{
          margin: 10px;
        }
        .descr{
          margin-top: 40px;
        }
      }
    }

  }
</style>
