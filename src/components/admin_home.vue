<template>
  <div id="admin_home">
    <el-container>
      <el-header>
        <el-button type="primary" @click="navigateBack">返回</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
          >
            <template v-for="route in this.$router.options.routes">
              <template v-if="route.children && route.children.length && route.name=='adminhome'">
                <template v-for="item in route.children">
                  <el-menu-item
                    :key="route.path + '/' + item.path"
                    :index="route.path + '/' + item.path"
                    background-color="#B0C4DE"
                  >
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{ item.name }}</span>
                  </el-menu-item>
                </template>
              </template>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name : "adminHome",
  data : () => ({
    isCollapse : false,
  }),
  methods : {
    navigateBack(){
      this.$router.push({path : '/mlogin'});
    }
  },
  mounted(){
    let that = this;
    if(this.Jget("adminInfo") == null){
      this.$message.error("请先登录");
      setTimeout(() => {
        that.navigateBack();
      }, 1000);
    }
  }
};
</script>

<style>
html,
body,
#admin_home,
.el-container {
  font-family: "Helvetica Neue";
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  border: 0px;
  width: 100%;
  height: 100%;
}
</style>