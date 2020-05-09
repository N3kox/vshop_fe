<template>
  <div id="item_manage">
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
      <el-table-column prop="createTime" width="110" label="创建日期" />
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.verify==0"
            @click="confirmItem(scope)"
            type="success"
            size="small"
          >审核通过</el-button>
          <el-button
            v-if="scope.row.verify==1"
            @click="refuseItem(scope)"
            type="danger"
            size="small"
          >下架</el-button>
          <el-button type="warning" size="small" @click="dropItem(scope)">删除商品</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  /* eslint-disable no-undef */
  name: "itemManage",
  data: () => ({
    adminInfo: {
      accid: null,
      level: null,
      name: null,
      pwd: null,
      uid: null
    },
    //全部商品
    items: []
  }),
  methods: {
    confirmItem(scope) {
      let that = this;
      let row = scope.row;
      this.$http
        .put(this.patchUrl(`/item/confirm?iid=${row.iid}`))
        .then(response => {
          if (response.body == null) {
            //unknown error
          } else {
            row.verify = 1;
            that.$set(that.items, scope.$index, row);
            that.$message({
              message: `物品 ${row.name} 已审核`,
              type: "success"
            });
          }
        });
    },

    refuseItem(scope) {
      let that = this;
      let row = scope.row;
      this.$http
        .put(this.patchUrl(`/item/refuse?iid=${row.iid}`))
        .then(response => {
          if (response.body == null) {
            //unknown error
          } else {
            row.verify = 0;
            that.$set(that.items, scope.$index, row);
            that.$message({
              message: `物品 ${row.name} 已下架`,
              type: "success"
            });
          }
        });
    },

    dropItem(scope) {
      let that = this;
      this.$confirm("确认永久删除此商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let row = scope.row;
          this.$http
            .delete(this.patchUrl(`/item/delete?iid=${row.iid}`))
            .then(response => {
              if (response.body == null) {
                //unknown error
              } else {
                that.getItems();
              }
            });
        })
        .catch(() => {});
    },

    getItems() {
      let that = this;
      this.$http.get(this.patchUrl(`/item/all`)).then(response => {
        if (response.body == null) {
          //错误处理
          window.console.log("Error:get all items!!");
        } else {
          that.items = response.body;
          that.items.forEach((value, index) => {
            value.createTime = value.createTime.slice(0, 10);
            value.src = that.patchUrl(`/image/item/${value.iid}.jpg`);
            that.$set(that.items, index, value);
          });
        }
      });
    }
  },

  mounted() {
    if (this.Jget("adminInfo").level < 2) {
      this.$message.error("您的权限不够");
      return;
    } else {
      this.getItems();
    }
  }
};
</script>

<style>
</style>