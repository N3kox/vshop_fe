<template>
  <div id="mo">
    <el-table :data="orders" ref="multipleTable" tooltip-effect="dark" style="width:90%">
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.src" width="40px" height="40px" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="value" label="总价" />
      <el-table-column prop="parsedState" label="订单状态" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.statement==0"
            @click="payClick(scope.row)"
            type="text"
            size="small"
          >付款</el-button>
          <el-button type="text" size="small" @click="deleteOrder(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="30%" title="付款中......" :visible.sync="paymentLoadingVisible" append-to-body></el-dialog>
  </div>
</template>

<script>
export default {
  name: "myOrders",
  data: () => ({
    userInfo: null,
    orders: [],
    paymentLoadingVisible : false,
  }),

  methods: {
    async init() {
      this.userInfo = this.Jget("userInfo");
      await this.getOrders();
      for (let index = 0; index < this.orders.length; index++) {
        await this.getOrdersDetails(this.orders[index].iid, index);
      }
      //window.console.log(this.orders);
    },

    getOrders() {
      var that = this;
      return new Promise((resolve, reject) => {
        that.$http
          .get(that.patchUrl(`/orders/mine?uid=${that.userInfo.uid}`))
          .then(
            response => {
              if (response.data == null) {
                that.$message.error("获取订单失败，请重试");
                reject(response.data);
              } else {
                that.orders = response.data;
                resolve(response.data);
              }
            },
            err => {
              //window.console.log("Response err:" + err);
              reject(err);
            }
          );
      });
    },

    getOrdersDetails(iid, index) {
      var that = this;
      return new Promise((resolve, reject) => {
        that.$http.get(that.patchUrl(`/item/get?iid=${iid}`)).then(
          response => {
            if (response.data == null || response.ok == false) {
              that.$message.error("Error 请刷新界面");
              //that.$message.error(`第${index+1}行商品已下架,请删除`);
            } else {
              let pump = that.orders[index];
              pump.parsedState = pump.statement == 0 ? "待付款" : "已付款";
              pump.name = response.data.name;
              pump.value = response.data.price * pump.quantity;
              pump.src = that.patchUrl(`/image/item/${iid}.jpg`);
              //解决
              that.$set(that.orders, index, pump);
            }
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        );
      });
    },

    async payClick(row) {
      var that = this;
      this.paymentLoadingVisible = true;
      await this.minusQuantity(row.iid, row.quantity);
      await this.finishOrder(row.oid);
      this.$message({ message: "付款成功", type: "success" });
      this.paymentLoadingVisible = false;
      setTimeout(() => {
        that.$router.go(0);
      }, 1000);
    },

    minusQuantity(iid, quantity) {
      var that = this;
      return new Promise((resolve, reject) => {
        that.$http
          .put(that.patchUrl(`/item/minusQuan?iid=${iid}&quantity=${quantity}`))
          .then(
            response => {
              if (response.body == null) {
                reject("lack of quantity");
              } else {
                resolve(response.body);
              }
            },
            err => {
              reject(err);
            }
          );
      });
    },

    finishOrder(oid) {
      var that = this;
      return new Promise((resolve, reject) => {
        that.$http
          .put(that.patchUrl(`/orders/finish?oid=${oid}`))
          .then(response => {
            if (response.data == null || response.data.statement == 0) {
              this.$message.error("订单付款失败");
              reject(response.data);
            } else {
              resolve(response.data);
            }
          });
      });
    },

    deleteOrder(row) {
        row;
        this.$message({message:"删除接口,不太想实现"})
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style>
</style>