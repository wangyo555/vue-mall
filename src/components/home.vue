<template>
  <div>
    home页面
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
