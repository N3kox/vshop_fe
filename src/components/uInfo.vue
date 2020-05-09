<template>
  <div id="u_info">
    <el-container>
      <el-header>
        <el-button type="primary" @click="navigateBack">返回</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="defaultActive"
            router
            class="el-menu-vertical-demo"
            @open="handleOpen"
            :collapse="isCollapse"
          >
            <template v-for="route in this.$router.options.routes">
              <template v-if="route.children && route.children.length && route.name == 'userInfo'">
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
  name: "uInfo",
  data: () => ({
    defaultActive: "da",
    isCollapse: false
  }),
  methods: {
    handleMenuSelect() {
      window.console.log("derb");
    },

    handleOpen() {},

    navigateBack() {
      this.$router.push({ path: "/" });
    }
  },
  mounted() {
    window.console.log(this.$router.options);
  }
};
</script>

<style>
html,
body,
#u_info,
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