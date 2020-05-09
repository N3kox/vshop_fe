<template>
    <div id = "app">
    <el-container style="height:100%" direction="vertical">
        <el-main>
            <div direction="horizontal" style="width:80%;">
                <el-form style="width:60%;margin:0 auto;">
                    <h2 style="margin-left:300px">Bistu VShop用户注册</h2>
                    <el-form-item label="账号" :label-width="labelWidth">
                        <el-input v-model="userInfo.accid" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="labelWidth">
                        <el-input type="password" v-model="userInfo.pwd" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="labelWidth">
                        <el-input type="password" v-model="userInfo.repeatPwd" auto-complete="off"/>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="labelWidth">
                        <el-input v-model="userInfo.name" auto-complete="off"/>
                    </el-form-item>
                    <div class="right-part" style="width:50%;float:right;text-align:right;">
                        <el-button icon="el-icon-circle-plus" type="primary" @click="commitReg">Button</el-button>
                    </div>
                </el-form>
            </div>
            
        </el-main>
        
    </el-container>
    </div>
</template>

<script>
export default {
    name : "login",
    data : () => ({
        labelWidth : "300px",
        userInfo : {
            accid : null,
            pwd : null,
            repeatPwd : null,
            name : null,
        },
    }),

    methods : {
        navigateBack(){
            this.$router.push({path : '/'});
        },

        commitReg(){
            window.console.log(this.userInfo);
            if(this.userInfo.accid == null || this.userInfo.pwd == null || this.userInfo.repeatPwd == null || this.userInfo.name == null)
                this.$message.error("请填写完整");
            else if(this.userInfo.pwd != this.userInfo.repeatPwd)
                this.$message.error("两次输入密码不相同");
            else
                this.sendReg(this.userInfo);
        },

        sendReg(userInfo){
            var that = this;
            this.$http
                .post(this.patchUrl(`/user/insert?accid=${userInfo.accid}&pwd=${userInfo.pwd}&name=${userInfo.name}`))
                .then(response => {
                    if(response.data.uid == null){
                        that.$message.error("账号重复,请修改")
                    }else{
                        that.Jset("userInfo", response.data);
                        that.$message({
                            message : "注册成功",
                            type : "success"
                        })
                        setTimeout(function(){
                            that.navigateBack();
                        },2000);
                    }
                })
        }
    },

    mounted() {
        window.console.log(this.beurl);
        window.console.log("reg ok");
    }
}
</script>