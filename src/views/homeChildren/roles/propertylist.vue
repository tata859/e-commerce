<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
              :data="propertyData"
              stripe
              border
              style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
                prop="authName"
                label="权限名称"
               >
        </el-table-column>
        <el-table-column
                prop="path"
                label="路径"
                >
        </el-table-column>
        <el-table-column
                label="权限等级">
          <template slot-scope="scope">
            <el-tag type='' v-if="scope.row.level==0">一级</el-tag>
            <el-tag type='success' v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type='warning' v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "property",
    data(){
      return {
        propertyData:[

        ]
      }
    },
    created(){
      this.getproperty()
    },
    methods:{
      async getproperty(){
        const {data:res} = await this.$http.get("rights/list")
        this.propertyData = res.data
      },
    },
  }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
</style>