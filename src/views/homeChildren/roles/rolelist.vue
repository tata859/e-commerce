<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加角色-->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="roleList"
              stripe
              border
              style="width: 100%">
        <!--展开列表-->
        <el-table-column
                type="expand">
          <template slot-scope="props">
            <el-row :class="['bbottom',index1===0?'btop':'']" v-for="(item1,index1) in props.row.children" :key="item1.id">
              <!--一级权限-->
              <el-col :span="5" class="el-col1">
                <el-tag closable @close="handleClose(props.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级与三级权限-->
              <el-col :span="19">
                <el-row :class="[index2===0?'':'btop']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6" class="el-col1">
                    <el-tag type="success" closable @close="handleClose(props.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" :class="[index3===0?'':'btop']" v-for="(item3,index3) in item2.children" :key="item3.id" closable  @close="handleClose(props.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--<pre>{{props.row}}</pre>-->
          </template>
        </el-table-column>
        <el-table-column
                type="index">
        </el-table-column>
        <el-table-column
                prop="roleName"
                label="角色名称">
        </el-table-column>
        <el-table-column
                prop="roleDesc"
                label="角色描述">
        </el-table-column>
        <el-table-column
                label="操作"
                width="200px"
        >
          <template slot-scope="scope">
            <el-row>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
                <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="propertyClick(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限对话框-->
    <el-dialog
            title="分配权限"
            :visible.sync="propertydialogVisible"
            width="50%"
            @close="cleardefkeys"
            >
      <el-tree :data="propertyList" :props="defaultProps"
               show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defkeys"
               ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="propertydialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addproperty">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "rolelist",
    data(){
      return {
        roleList:[],
        //分配权限
        propertydialogVisible:false,
        //树状权限列表
        propertyList:[],
        defkeys:[],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        //角色ID
        roleId:"",
      }
    },
    created(){
      this.getRoleList()
    },
    methods:{
      async getRoleList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        //this.$message.success(res.meta.msg)
        this.roleList = res.data
        console.log(res.data);
      },
      handleClose(role,rightId){
        console.log(role,rightId);
        this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          console.log(res);
          role.children = res.data
          // this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //分配权限
      async propertyClick(roles){
        this.roleId = roles.id
        //console.log(this.roleId);
        const {data:res} = await this.$http.get('rights/tree')
        console.log(res);
        this.propertyList = res.data
        //获取三级节点id
        this.getleafkeys(roles,this.defkeys)

        this.propertydialogVisible = true
      },
      //通过递归形式，获取角色下的三级权限的id，并保存到defkeys数组中
      getleafkeys(node,arr){
        //若node不包含children，则是三级节点
        if(!node.children){
          //console.log(node.id);
          return arr.push(node.id)
        }
        node.children.forEach(item=>{
          this.getleafkeys(item,arr)
        })
      },
      //关闭对话框清空数组
      cleardefkeys(){
        this.defkeys = []
      },
      //授权
      async addproperty(){
        const arrykeys=[
                ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idstr = arrykeys.join(",")
        console.log(idstr);
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
        console.log(res);
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRoleList()
        this.propertydialogVisible = false
      },
    },
  }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
  .el-col1{
    min-width: 120px;
  }
  .el-row{
    display: flex;
    align-items: center;
  }
  .el-tag{
    margin: 5px;
  }
  .btop{
    border-top: 1px solid #eee;
  }
  .bbottom{
    border-bottom: 1px solid #eee;
  }
</style>