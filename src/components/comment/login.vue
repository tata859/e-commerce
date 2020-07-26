<template>
  <div class="longin">
    <!--登录区域-->
   <div class="longin-content">
     <!--头像-->
     <div class="longin-avater">
       <img src="~assets/logo.png" alt="">
     </div>
      <!--登录表单-->
     <el-form label-width="0px"
              :model="longinform"
              class="longin-form"
              :rules="longinformrules"
              ref="longinform"
     >
        <!--用户-->
         <el-form-item prop="username">
           <el-input
                   placeholder="请输入用户名"
                   prefix-icon="iconfont icon-user"
                   v-model="longinform.username"
           ></el-input>
         </el-form-item>
        <!--密码-->
         <el-form-item prop="password">
           <el-input
                   placeholder="请输入密码"
                   prefix-icon="iconfont icon-3702mima"
                   v-model="longinform.password"
                   type="password"
           ></el-input>
         </el-form-item>
        <!--登录与重置-->
         <el-form-item class="btns">
           <el-button type="primary" @click="loginForm">登录</el-button>
           <el-button type="info" @click="resetForm">重置</el-button>
         </el-form-item>

       </el-form>

   </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data(){
    return {
      longinform: {
        username: 'admin',
        password: '123456',
      },
      //表单验证
      longinformrules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    //登录
    loginForm(){
      this.$refs.longinform.validate(async valid=>{
        if(!valid)return
        const {data:res} =await this.$http.post('login',this.longinform)
        console.log(res);
        if(res.meta.status!==200)return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem("token",res.data.token)
        this.$router.push('/home')
      })
    },
    //重置
    resetForm(){
      this.$refs.longinform.resetFields()
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .longin{
    background-color: #2b4b6b;
    height: 100%;

    .longin-content{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 5px;
      
      .longin-avater{
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        padding: 10px;
        width: 130px;
        height: 130px;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
        
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }

      .longin-form{
        position: absolute;
        bottom: 0;
        padding:0 20px;
        width: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        .btns{
          display: flex;
          justify-content: flex-end;
        }
      }

    }
  }
</style>
