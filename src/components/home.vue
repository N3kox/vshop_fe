<template>
    <div id = "app">
    <el-container style="height:100%" direction="vertical">
        <el-header>
            <div class="right-part" style="width:50%;float:right;text-align:right;">
                <el-button icon="el-icon-user-solid" type="primary" @click="mainPageLogin">{{loginButtonName}}</el-button>
                <el-button v-show = "isLogin" icon="el-icon-s-goods" style="background-color:#606266;border-color:#606266;color:white" @click="showCart">购物车</el-button>
                <el-button v-show = "isLogin" icon="el-icon-close" type="danger" @click="logout">注销</el-button>
            </div>
        </el-header>
        <el-main>
            <el-dialog width="550px" :title="loginPanelName" :visible.sync="loginDialogVisible" style="text-align:left;">
                <el-form>
                    <el-form-item label="账号" :label-width="formLabelWidth">
                        <el-input v-model="loginForm.accid" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="loginForm.pwd" type="password" autocomplete="off"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="navigateRegister">没有账号?</el-button>
                    <el-button type="primary" @click="confirmLoginForm">登 录</el-button>
                </div>
            </el-dialog>
                <div class="block" v-for="item in items" :key="items.indexOf(item)" style="width:250px;padding-left:30px;padding-bottom:10px;"
                    @click="blockClick(item)">
                    <el-card :body-style="{ padding : '10px'}" v-if="item.verify==1">
                    <el-image
                        style="width: 200px; height: 200px;margin-top:10px;"
                        :src="getItemImage(item.iid)"
                        :fit="fitMethod"></el-image>
                    <div style="padding-top:10px;">
                        <span class="demonstration">{{ item.name }}</span>
                    </div>
                    </el-card>
                </div>
                <el-dialog
                    title="商品详情"
                    :visible.sync="itemDetailVisible"
                    width="700px"
                    center>
                    <div style="text-align:left">
                    <el-image
                        style="width:300px; height: 300px;margin-top:10px;"
                        :src="getItemImage(curItem.iid)"
                        :fit="fitMethod"></el-image>
                        <div style="text-align:left;float:right;width:300px">
                            <div class="desc">名称 : {{curItem.name}}</div>
                            <div class="desc">价格 : {{curItem.price}}</div>
                            <div class="desc">余量 : {{curItem.quantity}}</div>
                            <div class="desc">描述 : {{curItem.description}}</div>
                            
                        </div>
                    </div>
                    <span slot="footer">
                        <span style="margin-right:10px">购买数量</span>
                        <el-input-number style="margin-right:90px" v-model="curItemCount" :min="1" :max="curItem.quantity" label="描述文字"/>
                        <el-button type="primary" @click="addToCart">加入购物车</el-button>
                    </span>
                </el-dialog>
                <el-dialog
                    title="购物车"
                    :visible.sync="cartDetailVisible"
                    width="700px"
                    center>
                    <el-dialog
                        width="30%"
                        title="付款中......"
                        :visible.sync="paymentLoadingVisible"
                        append-to-body>
                    </el-dialog>
                    <el-table
                        :data="cartData"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        @selection-change="handleCartSelectionChange"
                        style="width:90%">
                        <el-table-column label="商品图片">
                            <template slot-scope="scope">
                                <img :src="scope.row.src" width="40px" height="40px"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="商品名称"/>
                        <el-table-column prop="quantity" label="数量"/>
                        <el-table-column prop="value" label="总价"/>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button @click="payClick(scope.row)" type="text" size="small">付款</el-button>
                                <el-button type="text" size="small">待定</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
        </el-main>

    </el-container>
    </div>
</template>

<script>
export default {
    name : "fpage",
    data : () => ({
        loginButtonName : "登录",
        isLogin : false,

        loginPanelName : "登录",
        loginDialogVisible : false,
        
        userInfo : null,
        loginForm : {
            accid : null,
            pwd : null
        },
        formLabelWidth: "60px",
        items : [],
        fitMethod : "fill",
        cart : [],
        curItem : {
            iid : null,
            uid : null,
            name : null,
            price : null,
            quantity : null,
            description : null,
        },
        curItemCount : 1,
        itemDetailVisible : false,

        cartData : [],
        cartDetailVisible : false,
        paymentLoadingVisible : false,

    }),

    methods : {
        //跳转方法
        navigateRegister(){
            this.$router.push({path:'/reg'})
        },

        navigateFinish(order){
            this.$router.push({
                path:'/done',
                query:{order : order}
            })
        },
        
        navigateUserInfo(){
            this.$router.push({
                path : '/user',
            })
        },

        mainPageLogin(){
            this.userInfo = this.Jget("userInfo");
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if(this.userInfo != null){
                if(this.isLogin){
                    //已登录点击进入用户信息界面接口
                    this.navigateUserInfo();
                }else{
                    this.loginButtonVisible = true;
                    this.loginButtonName = this.userInfo.name
                    this.isLogin = true;
                    this.$message({
                        message : "欢迎回来,用户"+this.loginButtonName,
                        type : "success"
                    })
                }
                
            }else{
                //panel 显示
                this.loginDialogVisible = !this.loginDialogVisible;
            }
        },

        confirmLoginForm(){
            //window.console.log(this.loginForm);
            if(this.loginForm.accid == null || this.loginForm.pwd == null){
                this.$message.error("请输入账号密码");
            }else{
                this.loginDialogVisible = false;
                this.getLoginInfo(this.loginForm);
            }
        },

        getLoginInfo(loginForm){
            this.$http
                .get(this.patchUrl(`/user/login?accid=${loginForm.accid}&pwd=${loginForm.pwd}`))
                .then(response=>{
                    //window.console.log(response.data);
                    if(response.data.uid == null){
                        //login failed
                        this.refresh();
                        this.$message.error("登录失败,请重新输入");
                    }else{
                        this.userInfo = response.data;
                        this.Jset("userInfo",response.data);
                        //localStorage.setItem("userInfo", JSON.stringify(response.data));
                        this.mainPageLogin();
                    }
                })
        },

        logout() {
            this.loginButtonName = "登录";
            this.refresh();
            localStorage.removeItem("userInfo");
            this.$message({
                message : "登出成功",
                type : "success"
            })
        },

        refresh(){
            this.isLogin = false;
            this.userInfo = null;
            this.loginForm = {
                accid : null,
                pwd : null
            }
        },
        getAllGoods(){
            var that = this;
            this.$http
                .get(this.patchUrl(`/item/all`))
                .then(response=>{
                    if(response.data == null){
                        this.$message.error("unknown issues");
                    }else{
                        that.items = response.data;
                    }
                })
        },

        blockClick(item){
            this.itemDetailVisible = true;
            this.curItem = item;
            this.curItemCount = 1;
        },

        getItemImage(iid){
            return this.patchUrl(`/image/item/${iid}.jpg`);
        },

        addToCart(){
            this.itemDetailVisible = false;
            if(!this.isLogin){
                this.$message.error("请先登录");
                return;
            }
            var that = this;
            this.$http
                .post(that.patchUrl(`/orders/create?uid=${that.userInfo.uid}&iid=${that.curItem.iid}&quantity=${that.curItemCount}`))
                .then(response=>{
                    if(response.data == null){
                        this.$message.error("添加购物车失败,请重试");
                    }else{
                        this.$message({
                            message : "已加入购物车",
                            type : "success"
                        })
                    }
                })
            //window.console.log(this.cart);
        },

        async showCart(){
            await this.getMyOrders();
            for(let index = 0;index < this.cartData.length; index++){
                await this.getOrdersDetailsByIID(this.cartData[index].iid, index);
            }
            this.cartDetailVisible = true;
        },
        
        getMyOrders(){
            var that = this;
            return new Promise((resolve, reject)=>{
                this.$http
                    .get(that.patchUrl(`/orders/mine?uid=${that.userInfo.uid}&statement=0`))
                    .then(response=>{
                        if(response.data == null){
                            this.$message.error("购物车为空");
                        }else{
                            that.cartData = response.data;
                        }
                        resolve(response.data);
                    },err=>{reject(err)});
            })
        },
        
        getOrdersDetailsByIID(iid, index){
            var that = this;
            return new Promise((resolve, reject)=>{
                that.$http.get(that.patchUrl(`/item/get?iid=${iid}`))
                .then(res=>{
                    if(res.data == null){
                        this.$message.error(`第${index+1}行商品已下架,请删除`);
                        }else{
                            that.cartData[index].name = res.data.name;
                            that.cartData[index].value = res.data.price * that.cartData[index].quantity;
                            that.cartData[index].src = that.patchUrl(`/image/item/${iid}.jpg`);
                            window.console.log(that.cartData[index])
                            }
                            resolve(res.data);
                        },err=>{reject(err)});
            })
        },

        async payClick(row) {
            var that = this;
            this.paymentLoadingVisible = true;
            await this.minusQuantity(row.iid, row.quantity);
            await this.finishOrder(row.oid);
            this.$message({message : "付款成功",type : "success"})
            this.paymentLoadingVisible = false;
            setTimeout(() => {
                that.navigateFinish(row);
            }, 1000);
            
        },

        minusQuantity(iid, quantity){
            var that = this;
            return new Promise((resolve, reject)=>{
                that.$http
                    .put(that.patchUrl(`/item/minusQuan?iid=${iid}&quantity=${quantity}`))
                    .then(response=>{
                        if(response.body == null){
                            reject("lack of quantity");
                        }else{
                            resolve(response.body);
                        }
                    },err=>{reject(err)});
            })
        },

        finishOrder(oid){
            var that = this;
            return new Promise((resolve, reject)=>{
                that.$http
                    .put(that.patchUrl(`/orders/finish?oid=${oid}`))
                    .then(response=>{
                        if(response.data == null || response.data.statement == 0){
                            this.$message.error("订单付款失败");
                            reject(response.data);
                        }else{
                            resolve(response.data);
                        }
                    })
            })
        },

        // TODO:多选
        handleCartSelectionChange(val){
            window.console.log(val);
        }
        
        
    },

    mounted() {
        //window.console.log("homepage mounted");
        if(localStorage.getItem("userInfo") != null){
            this.mainPageLogin();
            //this.getCart();
        }
        this.getAllGoods();
        
    },
}
</script>

<style>
html,
body,
#app,
.el-container {
  font-family: "Helvetica Neue";
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  border: 0px;
  width: 100%;
  height: 100%;
}
.el-menu-vertical {
  width: 400px;
  min-height: 400px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 400px;
  min-height: 400px;
}

.el-header {
  text-align: left;
}

.left-part,
.right-part {
  width: 50%;
  float: left;
}

.right-part {
  text-align: right;
}

.function-button-management {
  margin-right: 10px;
}

.left-panel-control-button {
  padding-left: 10px;
}

.el-header,
.el-footer {
  background-color: #dcdfe6;
  color: #333;
  padding-left: 10px;
  line-height: 60px;
}

.el-footer {
  text-align: right;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.el-table .warning-row {
  background: #ffadad;
}

.block {
    float:left;
}

.desc{
    padding-top:10px;
    width:200px;
    font-size: 17px;
}

</style>