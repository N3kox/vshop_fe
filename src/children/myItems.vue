<template>
  <div>
    <el-table :data="items" ref="multipleTable" tooltip-effect="dark" style="width:90%">
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.src" width="40px" height="40px" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="quantity" label="余量" />
      <el-table-column prop="parsedVerify" label="审核状态" />
      <el-table-column prop="createTime" width="110" label="创建日期" />
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="dropItem(scope)">删除商品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="500px" title="确定删除?" :visible.sync="deletePanelVisible">
      <el-button type="danger" @click="confirmDelete">确定</el-button>
      <el-button @click="cancelDelete">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "my_items",
  data: () => ({
    deletePanelVisible: false,
    userInfo: {},
    items: [],
    selectedItemInfo: {}
  }),

  methods: {
    getItems() {
      let that = this;
      this.$http
        .get(this.patchUrl(`/item/mine?uid=${that.userInfo.uid}`))
        .then(response => {
          if (response.body == null) {
            //错误处理
            window.console.log("Error:get mine items!!");
          } else {
            that.items = response.body;
            that.items.forEach((value, index) => {
              value.createTime = value.createTime.slice(0, 10);
              value.parsedVerify = value.verify == 0 ? "待审核" : "已通过";
              value.src = that.patchUrl(`/image/item/${value.iid}.jpg`);
              that.$set(that.items, index, value);
            });
          }
        });
    },
    dropItem(scope) {
      this.selectedItemInfo = scope;
      this.deletePanelVisible = true;
    },
    confirmDelete() {
      let that = this;
      this.$http
        .delete(
          this.patchUrl(`/item/delete?iid=${this.selectedItemInfo.row.iid}`)
        )
        .then(response => {
          window.console.log(response.body);
          that.$router.go(0);
          that.$message({
            message: "删除商品成功",
            type: "success"
          });
          that.deletePanelVisible = false;
        });
    },
    cancelDelete() {
      this.deletePanelVisible = false;
    }
  },

  mounted() {
    this.userInfo = this.Jget("userInfo");
    this.getItems();
  }
};
</script>

<style>
</style>