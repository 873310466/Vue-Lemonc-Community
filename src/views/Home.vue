<template>
  <el-container style="  max-width: 1000px;margin: 0 auto">
    <!--头部-->
    <el-header height="60px">
      <common-header/>
    </el-header>
    <!--主体-->
    <el-main >
      <router-view/>
    </el-main>
    <el-footer>
      <footer class="footer">
        Copyright © 2020 柠檬C社区
        <span style="margin: 0 .7em" >·</span>
        <span class="about" @click="$router.push('/about')">关于本站</span>
      </footer>
    </el-footer>

    <!--右下角的建议反馈图标-->
    <el-tooltip effect="light" content="建议反馈" placement="left">
      <div class="feedback"   @click="showAdviceDialog">
        <i class="iconfont lm-icon-question1"
           style="font-size: 22px;line-height: 40px;"
        ></i>
      </div>
    </el-tooltip>

    <!--友情建议对话框-->
    <el-dialog
      :visible.sync="adviceDialogVisible"
      ref="adviceDialog"
      width="400px"
    >
      <span style="font-size: 23px" slot="title">
        <i class="el-icon-s-promotion" style="color: #00aae2;margin-right: 5px"></i>Tips
      </span>
      <!--友情建议表单-->
      <common-form :form-label="adviceFormLabel" :form="adviceFormData" :form-rules="adviceFormRule"
                   :label-position="'top'"></common-form>
      <span slot="footer">
        <el-button @click="adviceDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="commitAdvice" :loading="btnSendTipsLoading">提 交</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import CommonHeader from '../components/CommonHeader'
import { mapMutations, mapState } from 'vuex'
import CommonForm from '../components/CommonForm'

export default {
  name: 'Home',
  data () {
    return {
      // 控制 advice对话框 显隐
      adviceDialogVisible: false,
      // 控制 提交按钮 加载效果
      btnSendTipsLoading: false,
      // 建议表单的数据
      adviceFormData: {
        adviser: '',
        content: ''
      },
      // 建议表单的标签
      adviceFormLabel: [
        {
          label: '联系方式',
          prop: 'adviser',
          placeholder: '(可选) 仅用于反馈交流 OwO~'
        },
        {
          label: '友情建议',
          prop: 'content',
          type: 'textarea',
          placeholder: '欢迎交流、欢迎交流~~O(∩_∩)O',
          minRows: 6
        }
      ],
      // 建议表单的校验规则
      adviceFormRule: {
        content: [
          {
            required: true,
            message: '请输入一些文字叭~',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 200,
            message: '长度在 3 到 200 个字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 设置登录状态,es6
    ...mapMutations(['setIsLogin', 'setUserInfo', 'setUnreadCount']),
    // 获取token（服务端传来的uuid）
    getKey () {
      if (window.location.href) {
        const arr = window.location.href.split('#')
        if (arr.length === 2) {
          const subArr = arr[0].split('=')
          if (subArr.length === 2) {
            this.key = subArr[1]
          }
        }
      }
    },
    // 获取用户未读信息数量
    async getUnread () {
      // 立马获取
      const { data: res } = await this.$http().get('/notification/unread', {
        params: {
          id: this.userInfo.id
        }
      })
      this.setUnreadCount(res.data)
      // 轮询获取,30s
      setInterval(async () => {
        const { data: res } = await this.$http().get('/notification/unread', {
          params: {
            id: this.userInfo.id
          }
        })
        this.setUnreadCount(res.data)
      }, 30 * 1000)
    },
    // 携带token获取用户信息
    async getUserInfo () {
      if (this.key) {
        const { data: res } = await this.$http().get('/user/userInfoByToken', {
          params: {
            token: this.key
          }
        })
        if (res.code !== 200) return this.$message.error('获取用户信息失败')
        const userInfo = res.data
        // 将token存储在本地
        window.localStorage.setItem('token', this.key)
        // 存储用户信息
        this.setUserInfo(userInfo)
        // 设置登录状态为true
        this.setIsLogin(true)
        // 获取未读消息数
        await this.getUnread()

        // 将地址栏地址设为不带key的，看着顺眼，也防止多次提交
        window.history.pushState({}, '', 'http://localhost/#/')
      } else {
        // 检查本地是否有token，如果有就向服务端发送请求检查token是否过期，若没过期，则获取用户信息
        const token = window.localStorage.getItem('token')
        if (!this.isLogin && token) {
          const { data: res } = await this.$http().get('/user/userInfoByToken', {
            params: {
              token: token
            }
          })
          if (res.code !== 200) return
          const userInfo = res.data
          this.setIsLogin(true)
          this.setUserInfo(userInfo)
          await this.getUnread()
        }
      }
      // 如果没有token，不执行任何操作
    },
    // 显示tips对话框
    showAdviceDialog () {
      this.adviceDialogVisible = true
    },
    // 提交建议
    commitAdvice () {
      const form = this.$refs.adviceDialog.$children[2].$refs.form
      form.validate(async (valid) => {
        if (valid) {
          this.btnSendTipsLoading = true
          const { data: res } = await this.$http().post('/public/email/', this.adviceFormData)
          if (res.code !== 200) return this.$message.error('发送失败，请重新尝试QAQ')
          this.$message.success('发送成功！欢迎交流 OwO~')
          this.btnSendTipsLoading = false
          this.adviceDialogVisible = false
        }
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  components: { CommonForm, CommonHeader },
  async created () {
    await this.getKey()
    await this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #faf9fa;
    width: 100%;
    margin: 0 auto;
    padding-left: 0;
    padding-right: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .el-main{
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bbbcbc;
    margin-top: 10px;
    font-size: 14px;

    .about{
      cursor: pointer;
    }
    .about:hover{
      color: #00aae2;
    }
  }
  .feedback {
    position: fixed;
    bottom: 30px;
    right: 60px;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    text-align: center;
    color: #1989fa;
    border-radius: 50%;
    cursor: pointer;
    transition: .77s;
  }
  .feedback:hover {
    transform: rotateY(180deg) rotateX(180deg);
  }
/*  @media screen and (max-device-width: 600px){
    .el-header{
    }
    .el-main{
      height: 600px!important;
    }
  }*/
</style>
