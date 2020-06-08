<template>
  <div id="app">
    <el-backtop :bottom="100" :right="60">
      <div class="backtop">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-backtop>
    <router-view/>

  </div>
</template>

<style lang="scss">
  .backtop {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
    border-radius: 50%;
  }

</style>
