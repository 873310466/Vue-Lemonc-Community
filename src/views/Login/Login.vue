<!--
<template>
  <div class="login-card">
    <el-card shadow="hover">
      <div class="top">
        <div class="left">
          <div class="logo-area">
            <div class="logo"></div>
            <span class="name"> 柠檬C 社区</span>
          </div>
          <div class="form-area">
            <common-form
              :label-width="loginDialogConfig.labelWidth"
              :form-label="loginDialogConfig.loginFormLabel"
              :form="loginDialogConfig.loginFormData">
              <div class="btns">
                <el-button type="text">忘记密码</el-button>
                <el-button type="primary" class="login">登录</el-button>
              </div>
            </common-form>
          </div>
        </div>
        <div class="right">
          <h3>第三方账号登录</h3>
          <el-button type="success" @click="giteeLogin">
            <i style="color: indianred" class="iconfont lm-icon-mayun"></i>Gitee 登录</el-button>
        </div>
      </div>

      <div class="bottom">
        还没有帐号 ?
        <el-button type="text">立即注册</el-button>
        <span style="color: #72b7dd;margin:0 5px">|</span>
        <el-button type="text" @click="backToIndex">游客访问</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import CommonForm from '../../components/CommonForm'
export default {
  name: 'Login',
  data () {
    return {
      loginDialogConfig: {
        type: 'login',
        labelWidth: '0px',
        loginFormLabel: [
          {
            label: '',
            prop: 'username',
            ref: 'login',
            placeholder: '请输入帐号',
            prefixIcon: 'el-icon-user'
          },
          {
            label: '',
            prop: 'password',
            inputType: 'password',
            placeholder: '请输入密码',
            prefixIcon: 'el-icon-lock'
          }
        ],
        loginFormData: {}
      }
    }
  },
  methods: {
    // 回到首页
    backToIndex () {
      this.$router.push('/')
    },
    // Gitee登录
    async giteeLogin () {
      const { data: res } = await this.$http().get('/gitee_user/auth')
      if (res.code !== 200) this.$message.error('请稍后再试')
      setTimeout(() => { window.location = res.data }
        , 1000)
    }
  },
  components: { CommonForm }
}
</script>

<style lang="scss" scoped>
.login-card {
  background-color: #72b7dd;
  height: 100%;
  width: 100%;

  /deep/ .el-card {
    position: absolute;
    padding: 50px 60px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-68%);
    width: 50%;
    height: 54%;
    text-align: center;
    margin: 100px auto;
    .el-card__body{

      height: 100%;
      position: relative;
    }
    /*卡片上半部分*/
    .top{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    /*卡片左边*/
    .left{
      .logo-area{
        width: 350px;
        position: absolute;
        left: 0;
        top: 0;
        .logo{
          display: inline-block;
          float: left;
          width: 100px;
          height: 100px;
          background: url("../../assets/img/logo.jpg")   no-repeat ;
          background-size: cover;
        }
        .name{
          float: left;
          height: 100%;
          margin: 26px 12px;
          /*display: flex;*/
          /*align-items: center;*/
          font-size: 35px;
          color: #78bb7b;
        }
      }
      .form-area{
        /*display: flex;*/
        /*align-items: center;*/
        position: absolute;
        left: 0;
        top: 153px;
        width: 45%;
        .btns{
          display: flex;
          justify-content: space-between;
          .login{
            width: 50%;
          }
        }
      }
    }
    /*卡片右边*/
    .right{
      height: 226px;
      width: 42%;
      padding: 60px 0 60px 60px;
      border-left: 1px solid #e6e6e6;
      h3{
        margin-top: -5px;
        margin-bottom: 60px;
        display: flex;
        justify-content: center;
      }
      .el-button{
        i{
          font-size: 20px;
          margin-right: 10px;
        }
        width: 250px;
        font-size: 20px;
      }
    }
    .bottom {
      padding-top: 10px;
      position: absolute;
      bottom: -10px;
      left: -60px;
      width: 115%;
      margin-top: 20px;
      height: 50px;
      background-color: #f5f5f5;
    }
  }

}

</style>
-->
