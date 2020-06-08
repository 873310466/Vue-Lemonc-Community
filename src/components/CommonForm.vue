<template>
  <el-form :inline="inline"
           :model="form"
           ref="form"
           :label-width="labelWidth"
           :label-position="labelPosition"
           status-icon :rules="formRules"
           @submit.native.prevent>
    <el-form-item v-for="item in formLabel"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label">

      <!--输入框-->
      <!--输入框前置icon prefix-icon-->
      <!--输入框后置icon suffix-icon-->
      <el-input
                v-if="!item.type||item.prop==='id'"
                :style="{width:item.cusWidth!==undefined?item.cusWidth:'100%'}"
                v-model="form[item.prop]"
                :placeholder="item.placeholder!==undefined?item.placeholder:'请输入'+item.label"
                :disabled="item.prop==='username'?isReadOnly:false"
                :type="item.inputType"
                :show-password="item.inputType==='password'"
                :prefix-icon="item.prefixIcon"
                :ref="item.ref"
                @focus="focus"
                @blur="blur"
                @keyup.enter.native="enter"
                autocomplete="off">
        <i slot="suffix" v-if="item.suffixIcon!==undefined" class="el-input__icon el-icon-search search" style="cursor: pointer" @click="enter"></i>
      </el-input>
      <!--多行文本输入框-->
      <el-input
        v-if="item.type==='textarea'"
        type="textarea"
        :autosize="{ minRows: item.minRows!==undefined?item.minRows:5, maxRows: item.maxRows!==undefined?item.maxRows:10}"
        :placeholder="item.placeholder!==undefined?item.placeholder:'请输入'+item.label"
        v-model="form[item.prop]"
      >
      </el-input>
      <!--下拉框-->
      <el-select
        :style="{width:item.isCusWidth?item.cusWidth:'100%'}"
        v-if="item.type==='select'"
        v-model="form[item.prop]"
        placeholder="请选择">
        <el-option v-for="sItem in item.opts"
                   :key="sItem.value"
                   :label="sItem.label"
                   :value="sItem.value"/>
      </el-select>
      <!--Switch-->
      <el-switch v-if="item.type==='switch'"
                 active-text="已激活"
                 inactive-text="未激活"
                 active-color="#13ce66"
                 inactive-color="#ff4949"
                 v-model="form[item.prop]"/>
      <!--日期-->
      <el-date-picker
        style="width: 100%"
        v-model="form[item.prop]"
        align="right"
        type="date"
        placeholder="选择日期"
        v-if="item.type==='date'"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
      </el-date-picker>
      <!--隐藏输入框，传输数据-->
      <el-input v-if="item.type==='hidden'"
                v-model="form[item.prop]"
                type="hidden"
      />
      <!--级联选择器-->
      <!--options 用来指定数据源-->
      <!--props 用来指定配置对象-->
      <!--change-on-select 允许选中任意节点-->
      <!--filterable 开启搜索功能-->
      <el-cascader
        ref="cascader"
        v-if="item.type==='cascader'"
        :show-all-levels="false"
        v-model="form[item.prop]"
        :options="item.opts"
        :props="{
          expandTrigger: 'hover',
          value:'id',
          label:'name',
          children: 'children',
          multiple:true
        }"
        filterable
        :placeholder="item.placeholder?item.placeholder:'请选择'+item.label"
        clearable
        @change="handleChange"
        @remove-tag="removeTag"/>
    </el-form-item>

    <!--插槽，放按钮啥的-->
    <el-form-item>
      <slot/>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    inline: Boolean,
    labelPosition: String,
    form: Object,
    formLabel: Array,
    formRules: Object,
    isReadOnly: Boolean,
    labelWidth: String
  },
  data () {
    return {
      /* 日期快截选择 */
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      parent_id: this.form.parent_id

    }
  },
  methods: {
    // focus触发
    focus () {
      this.$emit('focus')
    },
    // blur触发
    blur () {
      this.$emit('blur')
    },
    handleChange () {
      this.$emit('handleChange')
    },
    removeTag () {
      this.$emit('removeTag')
    },
    // 按下回车
    enter () {
      this.$emit('searchQuestion')
    }
  }

}
</script>

<style lang="scss" scoped>
  .el-cascader {
    width: 100%;
  }
  .search:hover{
    color: deepskyblue;
  }
</style>
