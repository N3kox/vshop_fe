<template>
  <div id="user_manage">
    <el-table :data="userInfo" ref="multipleTable" tooltip-effect="dark" style="width:90%">
      <el-table-column prop="uid" label="uid" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="accid" label="账号" />
      <el-table-column prop="level" width="100" label="用户等级" />
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="updateUserLevel(scope)" type="primary" size="small">修改用户等级</el-button>
          <el-button type="danger" size="small" @click="dropUser(scope.row)">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改用户等级" :visible.sync="levelChangeVisible" width="500" center>
      <p>用户id:{{curUserId}}</p>
      <p>当前用户等级:{{curUserLevel}}</p>
      <el-input-number v-model="curUserLevel" :min="1" :max="3" label="等级" />
      <el-button type="success" @click="confirmLevel">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userManage",
  data: () => ({
    levelChangeVisible: false,
    userInfo: [],
    curUserLevel: 0,
    curUserId: null,
    curUserIndex: -1
  }),

  methods: {
    getUserInfo() {
      let that = this;
      this.$http.get(this.patchUrl(`/user/all`)).then(response => {
        if (response.body == null) {
          //unknown error
        } else {
          let copy = response.body;
          let adminUid = that.Jget("adminInfo").uid;
          //禁止修改自身level
          for (let index = 0; index < copy.length; index++)
            if (copy[index].uid == adminUid) {
              copy.splice(index, 1);
            }
          that.userInfo = copy;
        }
      });
    },

    updateUserLevel(scope) {
      this.curUserIndex = scope.$index;
      this.curUserLevel = scope.row.level;
      this.curUserId = scope.row.uid;
      this.levelChangeVisible = true;
    },

    confirmLevel() {
      let that = this;
      that.$http
        .put(
          this.patchUrl(
            `/user/updateLevel?uid=${that.curUserId}&level=${that.curUserLevel}`
          )
        )
        .then(response => {
          if (response.body == null) {
            //unknown error
          } else {
            let copy = that.userInfo[that.curUserIndex];
            copy.level = that.curUserLevel;
            that.$set(that.userInfo, that.curUserIndex, copy);
            that.levelChangeVisible = false;
            that.$message({
              message: "修改用户等级成功",
              type: "success"
            });
          }
        });
    },

    dropUser(row) {
      let that = this;
      this.$confirm("确认永久删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.$http
          .delete(this.patchUrl(`/user/delete?uid=${row.uid}`))
          .then(response => {
            if (response.body == null) {
              //unknown error
            } else {
              that.$message({
                message: `删除用户(uid=${row.uid} 用户名${row.name})成功`,
                type: "success"
              });
              that.getUserInfo();
            }
          });
      }).catch(()=>{});
    }
  },

  mounted() {
    if (this.Jget("adminInfo").level < 2) {
      this.$message.error("您的权限不够");
      return;
    }
    this.getUserInfo();
  }
};
</script>

<style>
</style>