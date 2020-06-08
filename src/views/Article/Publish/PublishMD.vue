<template>
  <div>
    <header class="title">
      <div class="left-box">
        <el-input v-model="publishFormData.title" placeholder="输入文章标题..."></el-input>
      </div>
      <div class="right-box">
        <div class="publish-block">
          <div class="publish-btn-show" @click="togglePanel">
            发布
          </div>
          <i class="iconfont lm-icon-tuichu goback" @click="$router.push('/')"></i>
          <div class="panel" v-if="panelVisibility">
            <div class="title">
              发布文章
            </div>
            <div class="tag-box">
              <div class="sub-title">
                标签
              </div>
              <el-cascader
                style="width: 100%"
                :show-all-levels="false"
                placeholder="请选择标签"
                v-model="publishFormData.tagIdList"
                :options="tagList"
                clearable
                filterable
                :props="{
                  expandTrigger: 'hover',
                  value:'id',
                  label:'name',
                  children: 'children',
                  multiple:true
                  }"
                @change="addTag"
                @remove-tag="removeTags"
              ></el-cascader>
            </div>
            <div class="publish-btn">
              <el-button type="success" :loading="publishBtnLoading" @click="publishArticle">确定并发布</el-button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="content-block">
      <!--
        预览
        :toolbarsFlag="false"
        :subfield="false"
        defaultOpen="preview"
        @change="change"
      -->
      <mavon-editor
        v-model="publishFormData.detail"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        ref="md"
        toolbarsBackground="#eeeeee"
        navigation
        class="content-box"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AESUtil from '../../../utils/AESUtil'

export default {
  name: 'PublicshMD',
  data () {
    return {
      // 点击发布按钮出现的panel
      panelVisibility: false,
      // 发表文章按钮加载效果
      publishBtnLoading: false,
      publishFormData: {
        id: '',
        authorId: '',
        title: '',
        detail: '',
        // 标签ID
        tagIdList: []
      },
      // 标签数组
      tagList: [],
      articleHtml: '' // 及时转的html

    }
  },
  methods: {
    // ======================数据区================================
    // 获取标签数据
    async getTags () {
      const { data: res } = await this.$http().get('/public/tag/')
      if (res.code !== 200) return this.$message.error('标签库出差了欸QAQ')
      this.tagList = res.data
    },
    // 当点击编辑的时候需要进行回显
    async getArticleData () {
      const { data: res } = await this.$http().get(`/article/${this.publishFormData.id}`)
      if (res.code !== 200) return this.$message.warning('暂时出错')
      this.publishFormData.title = res.data.title
      this.publishFormData.detail = res.data.detail
      this.publishFormData.tagIdList = []
      res.data.tagList.forEach(item => {
        const first = parseInt((item.id + '').substring(0, 1))
        if (first === 3) {
          this.publishFormData.tagIdList.push([item.parentId, item.id])
        } else {
          this.publishFormData.tagIdList.push([first, item.parentId, item.id])
        }
      })
    },
    // ======================核心功能=============================
    // 发布/更新文章
    publishArticle () {
      const isOK = this.validateArticleData()
      if (isOK) {
        this.publishFormData.authorId = this.userInfo.id
        // flat可以把多维数组转化成一维数组，默认是1层即二维数组
        this.publishFormData.tagIdList = this.publishFormData.tagIdList.flat()
        // 删除最后一个，因为是undefined
        // this.publishFormData.tagIdList.pop()
        this.publishBtnLoading = true
        setTimeout(async () => {
          const { data: res } = await this.$http().post('/article/', this.publishFormData)
          if (res.code !== 200) {
            console.log(res)
            return this.$message.warning('发布失败，请稍后再试~')
          }
          this.$message.success('发布成功')
          this.publishBtnLoading = false
          await this.$router.push('/')
        }, 500)
      }
    },
    // 校验文章数据是否合格
    validateArticleData () {
      let titleFlag = true
      let detailFlag = true
      let tagFlag = true
      if (this.publishFormData.title === '' || this.publishFormData.title === undefined) {
        this.$notify({
          dangerouslyUseHTMLString: true,
          message: '请先填写<span style="color: orangered">文章标题</span>~',
          type: 'warning'
        })
        titleFlag = false
      }
      // 设置时间间隔，以免堆叠在一起
      if (this.publishFormData.detail === '' || this.publishFormData.detail === undefined) {
        setTimeout(() => {
          this.$notify({
            message: '请填写<span style="color: deeppink">文章内容</span>~',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
        }, 100)
        detailFlag = false
      }
      if (this.publishFormData.tagIdList.length === 0) {
        setTimeout(() => {
          this.$notify({
            dangerouslyUseHTMLString: true,
            message: '请选择<span style="color: red">文章标签</span>~',
            type: 'warning'
          })
        }, 200)
        tagFlag = false
      }
      return tagFlag && titleFlag && detailFlag
    },
    async imgAdd (pos, $file) {
      const formdata = new FormData()
      formdata.append('image', $file)
      const { data: res } = await this.$http().post('/file/upload', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      this.$refs.md.$img2Url(pos, res.data)
    },
    // 文件删除
    async imgDel (fileUrl) {
      const first = fileUrl[0].split('?')
      const fileName = first[0].split('/')[3]
      const { data: res } = await this.$http().delete('/file/delete', { params: { fileName: fileName } })
      if (res.code !== 200) return this.$message.warning(res.label)
    },
    // 所有操作都会被解析重新渲染
    change (value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render
    },
    // =======================辅助功能==============================
    togglePanel () {
      this.panelVisibility = !this.panelVisibility
    },
    addTag (tagId) {
      // this.publishFormData.tagIdsList.push(tagId)
    },
    removeTags (tagsId) {
      this.publishFormData.tagIdList.filter(item => item !== tagsId)
    },
    // 校验是否有权限修改文章
    async validatePermission (articleId) {
      const { data: res } = await this.$http().get('/article/validate', {
        params: {
          aid: articleId,
          uid: this.userInfo.id
        }
      })
      if (res.code !== 200) {
        return this.$router.push('/')
      }
    }

  },
  computed: {
    ...mapState({
      isLogin: 'isLogin',
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    const id = AESUtil.decrypt(decodeURI(this.$route.query.p1))
    if (id !== '0') {
      // 校验是否有权限进行修改文章
      this.validatePermission(id)
      this.publishFormData.id = id
      this.getArticleData()
    }
    this.getTags()
  }
}
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0 1.1rem;
    height: 4.3rem;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    z-index: 90;

    .left-box {
      width: 100%;

    }

    .right-box {
      display: flex;

      justify-content: flex-end;
      align-items: center;

      .publish-block {
        display: flex;
        position: absolute;

        .goback {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          cursor: pointer;
        }
        .goback:hover{
          color: red;
        }

        .publish-btn-show {
          font-size: 1.2rem;
          white-space: nowrap;
          margin-right: 35px;
          color: #007fff;
          cursor: pointer;
        }

        .panel::before {
          content: "";
          position: absolute;
          width: 1rem;
          height: 1rem;
          transform: rotate(45deg);
          left: 71%;
          top: -9px;
          border: 1px solid #dddddd;
          border-bottom: none;
          border-right: none;
          background-color: #ffffff;
        }

        .panel {
          position: absolute;
          margin: 1.37rem -4.5rem 0 0;
          padding: 2rem;
          top: 100%;
          right: 70px;
          width: 14rem;
          font-size: 1.2rem;
          white-space: nowrap;
          color: #909090;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 2px;
          box-shadow: 0 1px 2px #f1f1f1;
          cursor: default;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          z-index: 100;

          .title {
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px #eee solid;
            font-size: 1.4rem;
            font-weight: 700;
            color: hsla(218, 9%, 51%, .8);
          }

          .tag-box {
            margin-bottom: 1.6rem;

            .sub-title {
              margin-bottom: 1rem;
            }
          }

        }

      }

    }

  }

  .content-box {
    position: relative;
    top: 69px;
    height: 88vh;
    z-index: 50;
  }
</style>
<style>
  .left-box .el-input__inner {
    margin: 0;
    padding: 0;
    font-size: 24px;
    font-weight: 700;
    color: #000;
    border: none;
    outline: none;
    cursor: auto;
    flex: 1 1 auto;
    height: 100%;
  }

  .publish-btn .el-button {
    width: 100%;
  }
</style>
