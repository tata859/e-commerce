<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--搜索与添加-->
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="userdialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userlist" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                    v-model="scope.row.mg_state" @change="userstateschange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="modify(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small" @click="property(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deletebtn(scope.row.id)"></el-button>
            </el-tooltip>


          </template>
        </el-table-column>
      </el-table>
      <!--分页列表-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1,2,5,10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
      <!--添加用户弹出框-->
    <el-dialog
            title="添加用户"
            :visible.sync="userdialogVisible"
            width="50%"
            @close="formClose"
            >
      <!--内容主体-->
      <el-form :model="userruleForm"
               :rules="userrules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userruleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="userdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser(userruleForm)">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户弹出框-->
    <el-dialog
            title="修改用户"
            :visible.sync="modifydialogVisible"
            width="50%"

    >
      <!--内容主体-->
      <el-form :model="modifyuserruleForm"
               :rules="userrules"
               ref="modifyruleForm"
               label-width="100px"
               class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modifyuserruleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="modifyuserruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyuserruleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifydialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyuserInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改权限/角色弹出框-->
    <el-dialog
            title="分配角色"
            :visible.sync="changdialogVisible"
            width="50%"
            >
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>新的角色：
          <el-select v-model="value" placeholder="请选择">
            <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="changdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "userlist",
    data(){
      //自定义验证表单
      var checkTel = (rule, value, callback) => {
        var regtel = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(regtel.test(value))return callback()
        callback(new Error("手机格式不正确"))
      }
      var checkEmail = (rule, value, callback) => {
        var regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
        if(regEmail.test(value))return callback()
        callback(new Error("邮箱格式不正确"))
      }
      return {
        //用户列表参数
        queryInfo:{
          query:"",
          pagenum:1,    //当前页数
          pagesize:5    //每页的数量
        },
        userlist:[],
        //用户信息
        userInfo:{},
        total:0,
        userdialogVisible:false,  //添加用户对话框显示与隐藏
        modifydialogVisible:false, //修改用户信息对话框
        changdialogVisible:false,  //修改权限
        //添加用户信息
        userruleForm:{
          username:"",
          password:"",
          mobile:"",
          email:"",
        },
        //用户验证
        userrules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {validator: checkTel,trigger: 'blur'}
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator: checkEmail,trigger: 'blur'}
          ]
        },
        //查询到的用户信息
        modifyuserruleForm:{},
        //角色列表
        roleList:[],
        //选定的角色
        value: '',
      }
    },
    created(){
      this.getuserlist()
    },
    methods:{
      //获取用户列表
      async getuserlist(){
        const {data:res} = await this.$http.get("users",{params:this.queryInfo})
        console.log(res);
        if(res.meta.status!==200)return this.$message.error('获取用户列表失败')
        this.userlist = res.data.users
        this.total = res.data.total
      },
      //每页数量改变时触发
      handleSizeChange(newSize){  //newSize每页条数量
        this.queryInfo.pagesize = newSize
        this.getuserlist()
      },
      handleCurrentChange(newPage){ //newPage页码数
        this.queryInfo.pagenum = newPage
        this.getuserlist()
      },
      //用户状态
      async userstateschange(userInfo){
        const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)

        if(res.meta.status!==200){
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error(res.meta.msg)
        }
        return this.$message.success(res.meta.msg)
      },
      //添加用户框关闭
      formClose(){
        this.$refs.ruleForm.resetFields()
      },
      //添加用户
      adduser(){
        this.$refs.ruleForm.validate(async valid => {
          if(!valid)return
          const {data:res} = await this.$http.post("users",this.userruleForm)
          if(res.meta.status!==201)return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.userdialogVisible = false
          this.getuserlist()
        })
      },
      //查询用户信息
      async modify(id){
        const {data:res} = await this.$http.get("users/" + id)
        console.log(res);
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.modifyuserruleForm = res.data
        this.modifydialogVisible = true
      },
      //修改用户信息
      modifyuserInfo(){
        this.$refs.modifyruleForm.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.put("users/" + this.modifyuserruleForm.id,this.modifyuserruleForm)
          if(res.meta.status!==200)return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.modifydialogVisible = false
          this.getuserlist()
        })

      },
      //删除用户
      deletebtn(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
        ).then(async () => {
          const {data:res} = await this.$http.delete('users/'+ id)
          console.log(res);
          this.getuserlist()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          console.log(22),
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //修改角色
      async property(userInfo){
        this.userInfo = userInfo
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        console.log(res);
        this.roleList = res.data
        this.changdialogVisible =true
      },
      //点击修改角色
      async saveRoleInfo(){
        console.log(this.userInfo.id);
        if(!this.value){
          return this.$message.error("请选择要分配的角色信息")
        }
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.value})
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.changdialogVisible = false
        this.getuserlist()
      },
    },
  }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
  .el-table{
    margin-top: 15px;
    font-size: 13px;
  }
</style>