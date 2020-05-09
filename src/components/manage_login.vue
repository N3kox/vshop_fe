<template>
  <div id="manage_login">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">管理系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "manageLogin",
  data: () => ({
    logining: false,
    ruleForm: {
      username: null,
      password: null
    },
    rules: {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }]
    }
  }),
  methods: {
    navigateAdminPage() {
      this.$router.push({ path: "/adminhome" });
    },
    handleSubmit() {
      //validate测试
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let that = this;
          this.logining = true;
          this.$http
            .get(
              this.patchUrl(
                `/user/login?accid=${this.ruleForm.username}&pwd=${this.ruleForm.password}`
              )
            )
            .then(response => {
              that.logining = false;
              if (
                response.body == null ||
                (typeof response.body == "string" && response.body.length == 0)
              ) {
                that.$message.error("账密错误");
              } else if (response.body.level >= 2) {
                that.Jset("adminInfo", response.body);
                that.$message({
                  message: "登陆成功",
                  type: "success"
                });
                setTimeout(() => {
                  that.navigateAdminPage();
                }, 1500);
              } else {
                that.$message.error("当前账户权限不足,请联系管理员");
              }
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>