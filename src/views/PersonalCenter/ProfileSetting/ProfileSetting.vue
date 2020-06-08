<template>
  <div class="setting-block">
    <div class="setting-box">
      <h1>个人资料</h1>
      <ul class="setting-list">
        <li class="item">
          <span class="title">头像</span>
          <div class="avatar-box">
            <div class="avatar" :style="{backgroundImage: `url(${this.userInfo.avatarUrl})`}"></div>
            <div class="upload-box">
              <el-upload
                :action="`http://localhost:9001/file/upload/${userInfo.id?userInfo.id:''}`"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :headers="headers"
                :show-file-list="false"
              >
                <div slot="tip" class="el-upload__tip">支持 jpg、png 格式大小 2M 以内的图片</div>
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </div>
          </div>
        </li>
        <li class="item">
          <span class="title">昵称</span>
          <div class="input-box">
            <el-input v-model="userInfoData.name" @focus="clickEditBtn('name')" placeholder="请输入您的昵称"></el-input>
            <div class="action-box">
              <el-button type="text"  v-if="editNameBefore" @click="clickEditBtn('name')" icon="el-icon-edit">修改</el-button>
              <div class="action-doing" v-else>
                <el-button type="text" @click="saveUpdate('name')">保存</el-button>
                <el-button type="text" @click="cancelUpdate('name')" style="color: #666666">取消</el-button>
              </div>
            </div>
          </div>
        </li>
        <li class="item">
          <span class="title">简介</span>
          <div class="input-box">
            <el-input v-model="userInfoData.bio" @focus="clickEditBtn('bio')" placeholder="请输入您的简介"></el-input>
            <div class="action-box">
              <el-button type="text" v-if="editBioBefore" @click="clickEditBtn('bio')" icon="el-icon-edit">修改</el-button>
              <div class="action-doing" v-else>
                <el-button type="text" @click="saveUpdate('bio')">保存</el-button>
                <el-button type="text" @click="cancelUpdate('bio')" style="color: #666666">取消</el-button>
              </div>
            </div>
          </div>
        </li>
        <li class="item">
          <span class="title">邮箱</span>
          <div class="input-box">
            <el-input v-model="userInfoData.email" @focus="clickEditBtn('email')" placeholder="(可选) 请输入您的邮箱"></el-input>
            <div class="action-box">
              <el-button type="text" v-if="editEmailBefore" @click="clickEditBtn('email')" icon="el-icon-edit">修改</el-button>
              <div class="action-doing" v-else>
                <el-button type="text" @click="saveUpdate('email')">保存</el-button>
                <el-button type="text" @click="cancelUpdate('email')" style="color: #666666">取消</el-button>
              </div>
            </div>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Setting',
  data () {
    return {
      userInfoData: {
        id: '',
        name: 'LemonC',
        bio: 'LemonCGO',
        email: '',
        avatarUrl: ''
      },
      // 控制修改按钮显隐
      editType: '',
      editEmailBefore: true,
      editNameBefore: true,
      editBioBefore: true
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setUserInfoBio', 'setUserInfoEmail', 'setUserInfoName']),
    async getUserInfo () {
      const { data: res } = await this.$http().get(`/user/${this.userInfo.id}`)
      if (res.code !== 200) return this.$message.warning(res.label)
      this.setUserInfo(res.data)
      this.userInfoData.name = res.data.name
      this.userInfoData.bio = res.data.bio
      this.userInfoData.email = res.data.email
      this.userInfoData.id = res.data.id
      this.userInfoData.avatarUrl = res.data.avatarUrl
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式噢')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB噢qaq')
      }
      return isLt2M && (isPNG || isJPG)
    },
    // 取消修改
    cancelUpdate (type) {
      switch (type) {
        case 'name':
          this.editNameBefore = true
          break
        case 'bio':
          this.editBioBefore = true
          break
        case 'email':
          this.editEmailBefore = true
          break
      }
      this.getUserInfo()
    },
    // 确定修改
    async saveUpdate (type) {
      switch (type) {
        case 'name':
          this.editNameBefore = true
          this.setUserInfoName(this.userInfoData.name)
          break
        case 'bio':
          this.editBioBefore = true
          this.setUserInfoBio(this.userInfoData.bio)
          break
        case 'email':
          this.editEmailBefore = true
          // eslint-disable-next-line no-case-declarations
          const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
          if (reg.test(this.userInfoData.email)) {
            this.setUserInfoEmail(this.userInfoData.email)
          } else {
            this.$message.warning('邮箱格式错误了欸Orz')
            return
          }
          break
      }
      const { data: res } = await this.$http().put('/user/', this.userInfoData)
      if (res.code !== 200) return this.$message.warning(res.label)
      this.$notify({
        title: '更新成功',
        type: 'success'
      })
    },
    // 点击修改按钮
    clickEditBtn (type) {
      switch (type) {
        case 'name':
          this.editNameBefore = false
          this.editBioBefore = true
          this.editEmailBefore = true
          break
        case 'bio':
          this.editBioBefore = false
          this.editNameBefore = true
          this.editEmailBefore = true
          break
        case 'email':
          this.editEmailBefore = false
          this.editBioBefore = true
          this.editNameBefore = true
          break
      }
    },
    // 头像上传成功
    handleAvatarSuccess (res) {
      if (res.code !== 200) return this.$message.warning(res.label)
      this.setUserInfoAvatar(res.data)
      this.userInfoData.avatarUrl = res.data
      this.$notify.success({
        message: '更新成功'
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    headers () {
      return {
        token: window.localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.setting-block {
  position: relative;
  padding: 2.1rem 3.6rem 4.5rem;
  background-color: #fff;
  border-radius: 2px;
  width: 37rem;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  .setting-list{

    .item{
      display: flex;
      padding: 2rem 0;
      border-top: 1px solid #f1f1f1;
      align-items: center;

      .title{
        width: 7rem;
      }

      .input-box {
        display: flex;
        justify-content: flex-end;
        flex: 1;
        /deep/.el-input__inner{
          border: none;
          color: #909090;
          outline: none;
          font-size: 16px;
        }

        .action-box{
          display: flex;

          .action-doing{
            display: flex;
          }
        }
      }

      .avatar-box{
        display: flex;
        .avatar{
          flex: 0 0 auto;
          width: 5rem;
          height: 5rem;
          margin-right: 1rem;
          background-size: cover;
        }
        .upload-box {
          height: 5rem;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }
      }
    }
    .item:first-child{
      padding: 1rem 0;
    }
    .item:last-child{
      border-bottom: 1px solid #f1f1f1;
    }
  }

  ul{
    padding: 0;
    margin: 0;
    list-style: none;
  }

}
</style>
