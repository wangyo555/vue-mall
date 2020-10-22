<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/homeicon.png">
        <span>V-Mall后台</span>
      </div>
      <el-button @click="logout" type="primary">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-menu" @click="toggleCollapse">|||</div>
        <el-menu background-color="#414146" text-color="#fff" active-text-color="#ffd04b" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.path" v-for="(item, index) in menulist" :key="item.id">
            <template slot="title">
              <i :class="[iconlist[index], 'menu-icon']"></i>
              <span>{{item.authName}}</span>
            </template>         
            <el-menu-item @click="setActivePath(child.path)" :index="child.path" v-for="child in item.children" :key="child.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </template>  
            </el-menu-item>
            <!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
            <!-- <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
              <el-menu-item index="1-4">选项4</el-menu-item>
            </el-menu-item-group>-->
          </el-submenu> 
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menulist: [],
      iconlist:['el-icon-user-solid','el-icon-s-cooperation','el-icon-s-shop','el-icon-s-order','el-icon-s-marketing'],
      isCollapse: false,
      activePath: ''
    }
  },  
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    setActivePath(activepath){
      window.sessionStorage.setItem('activePath', activepath) 
      this.activePath = activepath     
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: #3caabf;
  > div{
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 700;

    img{
      height: 48px;
      width: 48px;
      margin-right: 10px;
    }
  }
}
.el-aside{
  background-color: #414146;
  .toggle-menu{
    text-align:center;
    font-size: 12px;
    line-height: 24px;
    // height: 24px;
    color: #fff;
    background:#545454;
    cursor: pointer;
  }
  .el-menu{
    border:none;
  }
}
.el-main{
  background-color: #f5f5f5;
}
.menu-icon{
  margin-right: 5px;
}
</style>
