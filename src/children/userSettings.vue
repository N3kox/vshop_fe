<template>
  <div id="setting">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button icon="el-icon-setting" @click="editName">修改名称</el-button>
          <el-button icon="el-icon-setting" style="margin-left:10px;" @click="editPwd">修改密码</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">my_blank</div>
      </el-col>
    </el-row>
    <el-dialog title="修改名称" :visible.sync="editNameVisible" width="700px" center>
      <div style="text-align:left;padding:10px;">
        <div>当前名称 : {{userInfo.name}}</div>
        <div style="margin-top:20px;">
          修改名称 :
          <el-input style="width:200px;" v-model="newName" placeholder="请输入新名称" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitNewName">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="editPwdVisible" width="700px" center>
      <div style="text-align:left;padding:10px;">
        <div style="margin-top:20px;">
          当前密码 :
          <el-input style="width:200px;" v-model="curPwd" placeholder="请输入当前密码" />
        </div>
        <div style="margin-top:20px;">
          新密码 :
          <el-input style="width:200px;" v-model="newPwd" placeholder="请输入新密码" />
        </div>
        <div style="margin-top:20px;">
          重复密码 :
          <el-input style="width:200px;" v-model="repeatNewPwd" placeholder="请重复新密码" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitNewPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "settings",
  data: () => ({
    userInfo: {
      name: null,
      pwd: null,
      uid: null
    },
    newName: null,
    curPwd : null,
    newPwd: null,
    repeatNewPwd: null,

    editNameVisible: false,
    editPwdVisible: false
  }),

  methods: {
    editName() {
      this.editNameVisible = true;
      this.newName = null;
    },

    editPwd() {
      this.editPwdVisible = true;
      this.curPwd = null;
      this.newPwd = null;
      this.repeatNewPwd = null;
    },

    submitNewName() {
      if (this.newName == null) {
        this.$message.error("请输入新名称后提交");
      } else if (this.newName == this.userInfo.name) {
        this.$message.error("请输入新名称");
      } else {
        let that = this;
        this.$http
            .put(this.patchUrl(`/user/updateName?uid=${that.userInfo.uid}&name=${that.newName}`))
            .then(response=>{
                if(response.body == null || response.ok == false){
                    that.$message.error("错误,请重试");
                }else{
                    that.userInfo.name = this.newName;
                    that.Jset("userInfo", this.userInfo);
                    that.$message({
                        message : '修改成功',
                        type : 'success'
                    })
                }
                that.editNameVisible = false;
            })
      }
    },

    submitNewPwd() {
        if(this.curPwd == null || this.newPwd == null || this.repeatNewPwd == null){
            this.$message.error("请输入完整");
        }else if(this.newPwd != this.repeatNewPwd){
            this.$message.error("两次密码输入不同")
        }else{
            let that = this;
            //window.console.log(this.patchUrl(`/user/updatePwd?uid=${that.userInfo.uid}&pwd=${that.curPwd}&newpwd=${that.newPwd}`));
            this.$http
                .put(this.patchUrl(`/user/updatePwd?uid=${that.userInfo.uid}&pwd=${that.curPwd}&newpwd=${that.newPwd}`))
                .then(response=>{
                    if(response.body == null || response.ok == false){
                        that.$message.error("错误，请重试");
                    }else if(response.body.pwd == that.userInfo.pwd){
                        that.$message.error("当前密码输入错误");
                    }else{
                        that.$message({
                            message : "修改成功",
                            type : "success"
                        })
                        window.console.log(response.data);
                        that.userInfo.pwd = response.data.pwd;
                        that.Jset("userInfo", that.userInfo);
                    }
                })
        }
    }
  },

  mounted() {
    this.userInfo = this.Jget("userInfo");
  }
};
</script>

<style>
html,
body,
#setting,
.el-container {
  font-family: "Helvetica Neue";
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  border: 0px;
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 40px;
  text-align: left;
  padding: 10px 10px 10px 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>