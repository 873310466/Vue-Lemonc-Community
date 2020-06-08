<template>
  <div class="collection-block">
    <div class="info-box">
      <div class="count">
        {{collectionData.count}} 篇文章
      </div>
      <div class="action-box">
        <el-tooltip effect="light" placement="top" content="取消收藏">
            <el-button  type="text" :disabled="articleData.length===0"  @click="showCancelBindDialog">
              <i style="color: #e6a23c;font-size: 15px;" class="el-icon-star-off"></i>
            </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" placement="top" content="删除">
          <el-popconfirm
            title="您确定删除该收藏夹吗 ?"
            @onConfirm="deleteCollection"
          >
            <el-button slot="reference" type="text"  ><i style="color: red;font-size: 15px;" class="el-icon-delete"></i></el-button>
          </el-popconfirm>
        </el-tooltip>
        <el-tooltip effect="light" placement="top" content="返回">
          <el-button type="text" @click="goBack">
            <i style="color:#78bb7b;font-size: 15px;" class="iconfont lm-icon-tuichu"></i>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="collection-title">
      <h1>
        {{collectionData.name}}
      </h1>
      <div class="opt-box">
        <el-tooltip effect="light" placement="top" content="编辑" >
          <el-button type="text" @click="showUpdateCltInfoDialog"><i class="el-icon-edit" style="font-size: 15px;" ></i></el-button>
        </el-tooltip>

      </div>

    </div>
    <div class="collection-detail">
      <h3>
        {{collectionData.detail}}
      </h3>
    </div>
    <newest @go2Detail="go2Detail" :article-data="articleData" :page-config="pageConfig"/>

    <!--修改收藏夹信息的对话框-->
    <!--用户编辑个人资料的对话框-->
    <el-dialog ref="updateCltDialog" width="340px" title="更新信息" :visible.sync="updateCltInfoConfig.visibility">
      <common-form :form="updateCltInfoConfig.formData"
                   :form-label="updateCltInfoConfig.formLabel"
                   :form-rules="updateCltInfoConfig.formRule"/>
      <div slot="footer" >
        <el-button size="small" round  @click="updateCltInfoConfig.visibility = false">取 消</el-button>
        <el-button size="small" round type="primary" :loading="updateCltInfoConfig.loading" @click="confirmUpdate">更 新</el-button>
      </div>
    </el-dialog>

    <!--取消收藏弹窗-->
    <el-dialog
      class="collections"
      title="取消收藏"
      :visible.sync="cancelCltInfoConfig.visible"
      width="22%"
      center>
        <div class="item" v-for="(item,i) in articleData" :key="i">
          <el-checkbox v-model="item.isChecked" @change="checked=>checkCollection(checked,item)">
            <span class="title">{{item.title}}</span>
            <span class="author">[ {{item.user.name}} ]</span>
          </el-checkbox>
        </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="cancelBindArticleCollection"
               :disabled="cancelCltInfoConfig.bindAtcCltData.articlesId.length===0">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import AESUtil from '../../../utils/AESUtil'
import { mapState } from 'vuex'
import CommonForm from '../../../components/CommonForm'
import Newest from '../../Article/Articles'

export default {
  name: 'Collection',
  components: { Newest, CommonForm },
  data () {
    return {
      // 更新收藏夹信息设置
      updateCltInfoConfig: {
        visibility: false,
        loading: false,
        formData: {
          id: '',
          name: '',
          detail: ''
        },
        formLabel: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '简介',
            prop: 'detail'
          }
        ],
        formRule: {
          name: [
            { required: true, message: '请输入收藏夹的名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 至 8 位', trigger: 'blur' }
          ]
        }
      },
      // 取消收藏夹信息设置
      cancelCltInfoConfig: {
        visible: false,
        // 文章-收藏夹 联系
        bindAtcCltData: {
          articlesId: []

        }
      },
      // 收藏夹对应的文章数据
      articleData: [],
      // 分页配置
      pageConfig: {
        curPage: 1,
        total: 0,
        isPage: true
      },
      // 收藏夹自身数据
      collectionData: {
        id: '',
        name: '',
        detail: '',
        count: ''
      }
    }
  },
  computed: {
    ...mapState({
      isLogin: 'isLogin',
      userInfo: state => state.user.userInfo,
      collectionId: state => state.collection.collectionId
    })
  },
  methods: {
    // 获取收藏夹自身数据
    async getCollectionData () {
      this.collectionData.id = AESUtil.decrypt(this.collectionId)
      const { data: res } = await this.$http().get(`/collection/c/${this.collectionData.id}`)
      if (res.code !== 200) return this.$message.warning(res.label)
      this.collectionData = res.data
    },
    // 获取收藏夹文章数据
    async getArticleInside () {
      const { data: res } = await this.$http().get('/article/collection', {
        params: {
          cid: this.collectionData.id
        }
      })
      if (res.code !== 200) return this.$message.warning(res.label)
      res.data.records.map(item => { item.isChecked = true })
      this.articleData = res.data.records
    },
    // 删除收藏夹本身
    async deleteCollection () {
      const { data: res } = await this.$http().delete(`/collection/${this.collectionData.id}`)
      if (res.code !== 200) return this.$message.warning(res.label)
      this.goBack()
    },
    // 返回用户主页
    goBack () {
      this.$router.push({
        path: '/personal',
        query: {
          p1: AESUtil.encrypt(this.userInfo.id),
          activeType: 'collection'
        }
      })
    },
    // 展示修改收藏夹信息的对话框(需要回显信息）
    showUpdateCltInfoDialog () {
      this.updateCltInfoConfig.visibility = true
      this.$nextTick(() => {
        // 创建用reset会好些
        /*        const cltForm = this.$refs.updateCltDialog.$children[2].$refs.form
        cltForm.resetFields() */
        // 数据回显,如果直接用collectionData 回显会有点问题
        this.updateCltInfoConfig.formData.name = this.collectionData.name
        this.updateCltInfoConfig.formData.detail = this.collectionData.detail
        this.updateCltInfoConfig.formData.id = this.collectionData.id
      })
    },
    // 确认修改收藏夹
    confirmUpdate () {
      this.updateCltInfoConfig.loading = true
      setTimeout(async () => {
        const { data: res } = await this.$http().put('/collection/', this.updateCltInfoConfig.formData)
        if (res.code !== 200) return this.$message.warning(res.label)
        this.updateCltInfoConfig.loading = false
        this.updateCltInfoConfig.visibility = false
        // 前端伪更新
        this.collectionData.name = this.updateCltInfoConfig.formData.name
        this.collectionData.detail = this.updateCltInfoConfig.formData.detail
      }, 233)
    },
    // 删除收藏夹
    deleteCltInfo () {
    },
    // 前往文章详情页面
    go2Detail (id) {
      const aid = AESUtil.encrypt(id)
      this.$router.push(`/detail?p1=${aid}`)
    },
    // 取消收藏 确认按钮
    async cancelBindArticleCollection () {
      const cancelBindData = this.cancelCltInfoConfig.bindAtcCltData
      // 赋值CID
      cancelBindData.collectionId = this.collectionData.id
      const { data: res } = await this.$http().delete('/article_collect/c/cancel', {
        data: cancelBindData
      })
      if (res.code !== 200) return this.$message.warning(res.label)
      this.$message.success('取消收藏成功')
      // 伪更新
      this.collectionData.count -= cancelBindData.articlesId.length
      this.articleData = this.articleData.filter(item => {
        // -1 说明没找到，也就是不属于要取消的范畴
        return cancelBindData.articlesId.indexOf(item.id) === -1
      })
      this.cancelCltInfoConfig.visible = false
    },
    // 展示 取消收藏 对话框
    showCancelBindDialog () {
      this.cancelCltInfoConfig.visible = true
    },
    // 点击收藏夹里面的checkBox
    checkCollection (isChecked, a) {
      const articlesId = this.cancelCltInfoConfig.bindAtcCltData.articlesId
      // 此时是取消收藏
      if (isChecked) {
        articlesId.splice(articlesId.indexOf(a.id), 1)
      } else {
        // 因为此时是取消收藏，所有要把取消收藏的收藏集ID传递过来
        articlesId.push(a.id)
      }
    }
  },
  async created () {
    await this.getCollectionData()
    await this.getArticleInside()
  }
}
</script>

<style lang="scss" scoped>
  .collection-block {
    position: relative;
    padding: .5rem 3.2rem 4.1rem;
    background-color: #fff;
    border-radius: 2px;
    width: 37rem;
    min-height: 70vh;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    .collection-title {
      font-size: 24px;
      display: flex;
      justify-content: center;
      position: relative;
      h1 {
        width: 417px;
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
        border-bottom: 1px solid #eeeeee;
        font-weight: bold;
        padding-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .opt-box {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    .collection-detail {
      width: 520px;
      margin: 0 auto;
      margin-bottom: 20px;

      h3 {
        margin-top: 0px;
        display: flex;
        justify-content: center;
        font-size: 18px;
        color: #c0c0c0;
        font-weight: normal;
        margin-bottom: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .info-box {
      line-height: 1;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 2rem;
      box-sizing: border-box;
      width: 100%;
      max-width: 960px;

      .count {
      }

      .action-box {
        width: 80px;
        display: flex;
        justify-content: space-between;
      }
    }

  }
</style>

<style lang="scss">
  /*取消收藏的弹窗*/
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
    .item{
      position: relative;
      .author {
        position: absolute;
        right: 0;
        color: #78bb7b;
        line-height: 15px;
      }
    }

  }
</style>
