<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
html,
body,
#app,
.el-container {
  padding: 0px;
  margin: 0px;
  border: 0px;
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: left;
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
</style>
