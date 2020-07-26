<template>
  <el-container class="home-contaiter">
    <!--头部区域-->
    <el-header>
      <div class="header-left">
        <img src="~assets/images/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button></el-header>
    <!--主体区域-->
    <el-container>
      <!--左侧菜单栏-->
      <el-aside :width='iscollapse?"64px":"200px"'>
        <div class="toggle-btn" @click="toggleBtn">|||</div>
        <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EEF"
                :unique-opened = true
                :collapse="iscollapse"
                :collapse-transition="false"
                router
                :default-active="navpath"
        >
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in Menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+MenulistItem.path"
                          v-for="MenulistItem in item.children"
                          :key="MenulistItem.id"
                          @click="navstate('/'+MenulistItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{MenulistItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "home",
    data(){
      return {
        Menulist:[],
        iconObj:{
          "125":'iconfont icon-users',
          "103":'iconfont icon-tijikongjian',
          "101":'iconfont icon-shangpin',
          "102":'iconfont icon-danju',
          "145":'iconfont icon-baobiao',
        },
        iscollapse:false,
        navpath:''
      }

    },
    created(){
      this.getMenulist()
      this.navpath = window.sessionStorage.getItem("navpath")
    },
    methods:{
      loginout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenulist(){
        const {data:res} = await this.$http.get("/menus")
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        //console.log(res);
        this.Menulist = res.data
      },
      //菜单折叠
      toggleBtn(){
        this.iscollapse = !this.iscollapse
      },
      navstate(navpath){
        window.sessionStorage.setItem("navpath",navpath)
        this.navpath = navpath
      },
    },
  }
</script>

<style lang="less" scoped>
  .home-contaiter{
    height: 100%;
    
    .el-header{
      display: flex;
      justify-content: space-between;
      background-color: #373d41;
      align-items: center;
      font-size: 20px;
      color: white;

      .header-left{
        img{
          vertical-align: middle;
        }
        span{
          margin-left: 10px;
          vertical-align: middle;
        }
      }
    }
    .el-container{

      .el-aside{
        background-color: #333744;
        
        .toggle-btn{
          width: 100%;
          background-color: #4A5064;
          text-align: center;
          font-size: 10px;
          line-height: 24px;
          letter-spacing: 0.2em;
          color: white;
          cursor: pointer;
        }

        .el-menu{
          border: none;
        }
      }
      .el-main{
        background-color: #eaedf1;
      }
    }
  }
  .iconfont{
    margin-right: 10px;
  }
</style>