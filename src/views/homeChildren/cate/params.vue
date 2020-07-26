<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert :closable="false" show-icon
              title="请选择第三级分类"
              type="warning">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
                  v-model="CateListValue"
                  :options="CateList"
                  :props="CateProps"
                  @change="handleCateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--参数-->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many" :disabled="disabledTabs">
          <el-button type="primary" :disabled="disabledTabs" @click="addParams">添加参数</el-button>
          <el-table
                  :data="manyData"
                  stripe
                  border
                  style="width: 100%">
            <el-table-column
                    type="index">
            </el-table-column>
            <el-table-column
                    prop="attr_name"
                    label="参数名称">
            </el-table-column>
            <el-table-column
                    label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top-start" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)"></el-button>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" :disabled="disabledTabs">
          <el-button type="primary" :disabled="disabledTabs" @click="addParams">添加属性</el-button>
          <el-table
                  :data="onlyData"
                  stripe
                  border
                  style="width: 100%">
            <el-table-column
                    type="index">
            </el-table-column>
            <el-table-column
                    prop="attr_name"
                    label="属性名称">
            </el-table-column>
            <el-table-column
                    label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top-start" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)"></el-button>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
       </el-tabs>
    </el-card>
    <el-dialog
            :title="titleText"
            :visible.sync="showDialogVisible"
            width="50%"
            @close="clearContent">
      <el-form :model="addForm" :rules="addFormRules" ref="ruleFormParams" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitParams">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "params",
    data(){
      return {
        //所有商品
        CateList:[],
        //选择的商品
        CateListValue:[],
        //级联配置
        CateProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        //参数与属性
        activeName:'many',
        //对话框显示与隐藏
        showDialogVisible:false,
        //要添加的属性
        addForm:{
          attr_name:'',
        },
        //验证
        addFormRules:{
          attr_name:[
            { required: true, message: '请输入要添加的名称', trigger: 'blur' },
          ],
        },
        //动态参数数据
        manyData:[],
        //静态属性数据
        onlyData:[],
      }
    },
    created(){
      this.getCateList()
    },
    computed:{
      disabledTabs(){
        return this.CateListValue.length===3?false:true
      },
      titleText(){
        if(this.activeName == "many"){
          return "添加动态参数"
        }else {
          return "添加静态属性"
        }

      },
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$http.get('categories')
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        console.log(res);
        this.CateList = res.data
      },
      handleCateChange(){
        var len=this.CateListValue.length
        this.getattributes(this.CateListValue[len - 1],this.activeName)
        //console.log(this.CateListValue);
      },
      handleTabsClick(){
        var len=this.CateListValue.length
        this.getattributes(this.CateListValue[len - 1],this.activeName)
        console.log(this.activeName);
      },
      //获取参数属性数据
      async getattributes(id,sel){
        const {data:res} = await this.$http.get(`categories/${id}/attributes`,{params:{sel:sel}})
        console.log(res);
        if(res.meta.status!==200)return this.$message.error(res.meta)
        if(sel=='many'){
          this.manyData = res.data
        }else {
          this.onlyData = res.data
        }
      },
      //关闭对话框
      clearContent(){

      },
      //点击添加
      addParams(){
        this.showDialogVisible = true
      },
      //点击确定
      submitParams(){
        var len=this.CateListValue.length
        console.log(this.addForm);
        this.$refs.ruleFormParams.validate(async valid =>{
          const {data:res} = await this.$http.post(`categories/${this.CateListValue[len - 1]}/attributes`,
              {
                attr_name:this.addForm.attr_name,
                attr_sel:this.activeName
              }
          )
          console.log(res);
          if(res.meta.status!==201)return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
        })
        this.handleTabsClick()
        this.showDialogVisible = false
      },
      //删除参数
      async deleteParams(paramsId){
        console.log(paramsId);
        var len=this.CateListValue.length
        const {data:res} = await this.$http.delete(`categories/${this.CateListValue[len - 1]}/attributes/${paramsId.attr_id}`)
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.handleTabsClick()
      },
    },
  }
</script>
<style>
  .el-popper,.el-scrollbar{
    height: 200px;
  }
</style>
<style scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .el-row{
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>