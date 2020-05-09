<template>
  <div id = "done" >
    <el-container style="height:100%,font-family:'PingFang SC'" direction="vertical">
        <el-main>
            <h3>付款成功</h3>
            <h3>商品名 : {{order.name}}</h3>
            <h3>数量 : {{order.quantity}}</h3>
            <h3>金额 : {{order.value}}</h3>
        </el-main>
        <el-footer>
            <el-button type="primary" @click="returnHomePage">返回</el-button>
        </el-footer>
    </el-container>
    </div>
</template>

<script>
export default {
    name : "done",
    data : ()=>({
        order : {
            name : null,
            quantity : null,
            value : null,
        }
    }),

    methods:{
        returnHomePage(){
            this.$router.push({path : '/'});
        }
    },

    mounted(){
        this.order = this.$route.query.order;
    }
}
</script>

<style>
html,
body,
#done,
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