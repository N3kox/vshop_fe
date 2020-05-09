<template>
  <div id="upload_item">
    <div style="width:500px;">
      <el-form>
        <el-form-item label="商品名" :label-width="formLabelWidth">
          <el-input v-model="itemForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth">
          <el-input v-model="itemForm.price" placeholder="请输入商品单价" />
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="itemForm.quantity" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="itemForm.description" placeholder="请输入商品描述" />
        </el-form-item>

        <el-upload
          class="upload_image"
          ref="upload"
          action="http://localhost:8080/item/upload/image"
          :on-preview="handlePreview"
          :on-success="handleExceed"
          :on-remove="handleRemove"
          :limit="1"
          :file-list="fileList"
          :auto-upload="false"
          list-type="picture"
          :multiple="false"
          :data="getItemInfo()"
          accept=".jpg"
        >
          <el-button style="margin-left:40px;" size="small" type="primary">点击上传图片</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
            style="width:500px;margin-left:10px;display:inline;"
          >最多上传一张商品图片，当前仅能上传jpg文件，且不超过500kb</div>
        </el-upload>
        <el-button
          style="margin-left:300px;margin-top:40px;"
          type="success"
          size="large"
          @click="submitUpload"
        >上传商品</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "uploadItem",
  data: () => ({
    formLabelWidth: "70px",
    itemForm: {
      iid: null,
      name: null,
      price: null,
      description: null,
      quantity: null
    },
    fileList: [],
  }),
  methods: {
    //图片用获取新增商品信息
    getItemInfo() {
      return this.itemForm;
    },

    handlePreview() {
      /*
      if(this.fileList.length == 1)
        this.$message.error("当前仅允许上传一张图片");
        */
      window.console.log(this.fileList);
    },
    handleExceed() {},
    handleRemove() {},
    submitUpload() {
      let that = this;
      if (
        this.itemForm.name == null ||
        this.itemForm.price == null ||
        this.itemForm.description == null ||
        this.itemForm.quantity == null
      ) {
        this.$message.error("请完整填写商品信息!");
      } else if (isNaN(this.itemForm.price)) {
        this.$message.error("商品价格请输入数字!");
      } else if (isNaN(this.itemForm.quantity)) {
        this.$message.error("商品数量请输入数字!");
      } else if (this.itemForm.price <= 0 || this.itemForm.quantity <= 0) {
        this.$message.error("请输入大于零的数字!");
      } else {
        //check done
        window.console.log(this.itemForm);
        let uid = this.Jget("userInfo").uid;
        this.$http
          .post(
            this.patchUrl(
              `/item/insert?uid=${uid}&name=${this.itemForm.name}&price=${this.itemForm.price}&description=${this.itemForm.description}&quantity=${this.itemForm.quantity}`
            )
          )
          .then(response => {
            if (response.body == null || response.ok == false) {
              //unk err
            } else {
              that.itemForm.iid = response.body.iid;
              //图片上传
              that.$refs.upload.submit();
              this.$message({message : "商品上传成功,等待审核", type : "success"});
              setTimeout(() => {
                that.$router.go(0);
              }, 1500);
              
            }
          });
      }
    }
  },
  mounted() {}
};
</script>

<style>
html,
body,
#upload_item,
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