<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="CategoriesClick">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
              :data="CategoriesList"
              :columns="columns"
              :selection-type="false"
              :expand-type="false"
              show-index
              border
      >
        <!--是否有效-->
        <template slot="likes" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error"v-else></i>
        </template>
        <!--排序-->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="operation" slot-scope="scope" >
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类-->
    <el-dialog
            title="添加分类"
            :visible.sync="categoriesdialogVisible"
            width="50%"
            @close="closeDialog"
            >
      <el-form :model="categoriesForm" :rules="categoriesRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader class="cascader"
                  v-model="selectekeys"
                  :options="parentCatelist"
                  :props="cateProps"
                  clearable
                  @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoriesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "categories",
    data(){
      return {
          options: [
            {
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                  {
                value: 'yizhi',
                label: '一致'
              },
                {
                value: 'fankui',
                label: '反馈'
              },
                {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }
              ]
            },
              {
              value: 'daohang',
              label: '导航',
              children: [
                  {
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          },
            {
            value: 'zujian',
            label: '组件',
            children: [
                {
              value: 'basic',
              label: 'Basic',
              children: [
                  {
                value: 'layout',
                label: 'Layout 布局'
              }, {
                value: 'color',
                label: 'Color 色彩'
              }, {
                value: 'typography',
                label: 'Typography 字体'
              }, {
                value: 'icon',
                label: 'Icon 图标'
              }, {
                value: 'button',
                label: 'Button 按钮'
              }]
            }, {
              value: 'form',
              label: 'Form',
              children: [
                  {
                value: 'radio',
                label: 'Radio 单选框'
              }, {
                value: 'checkbox',
                label: 'Checkbox 多选框'
              }, {
                value: 'input',
                label: 'Input 输入框'
              }, {
                value: 'input-number',
                label: 'InputNumber 计数器'
              }, {
                value: 'select',
                label: 'Select 选择器'
              }, {
                value: 'cascader',
                label: 'Cascader 级联选择器'
              }, {
                value: 'switch',
                label: 'Switch 开关'
              }, {
                value: 'slider',
                label: 'Slider 滑块'
              }, {
                value: 'time-picker',
                label: 'TimePicker 时间选择器'
              }, {
                value: 'date-picker',
                label: 'DatePicker 日期选择器'
              }, {
                value: 'datetime-picker',
                label: 'DateTimePicker 日期时间选择器'
              }, {
                value: 'upload',
                label: 'Upload 上传'
              }, {
                value: 'rate',
                label: 'Rate 评分'
              }, {
                value: 'form',
                label: 'Form 表单'
              }]
            }, {
              value: 'data',
              label: 'Data',
              children: [
                  {
                value: 'table',
                label: 'Table 表格'
              }, {
                value: 'tag',
                label: 'Tag 标签'
              }, {
                value: 'progress',
                label: 'Progress 进度条'
              }, {
                value: 'tree',
                label: 'Tree 树形控件'
              }, {
                value: 'pagination',
                label: 'Pagination 分页'
              }, {
                value: 'badge',
                label: 'Badge 标记'
              }]
            }, {
              value: 'notice',
              label: 'Notice',
              children: [
                  {
                value: 'alert',
                label: 'Alert 警告'
              }, {
                value: 'loading',
                label: 'Loading 加载'
              }, {
                value: 'message',
                label: 'Message 消息提示'
              }, {
                value: 'message-box',
                label: 'MessageBox 弹框'
              }, {
                value: 'notification',
                label: 'Notification 通知'
              }]
            }, {
              value: 'navigation',
              label: 'Navigation',
              children: [
                  {
                value: 'menu',
                label: 'NavMenu 导航菜单'
              }, {
                value: 'tabs',
                label: 'Tabs 标签页'
              }, {
                value: 'breadcrumb',
                label: 'Breadcrumb 面包屑'
              }, {
                value: 'dropdown',
                label: 'Dropdown 下拉菜单'
              }, {
                value: 'steps',
                label: 'Steps 步骤条'
              }]
            }, {
              value: 'others',
              label: 'Others',
              children: [
                  {
                value: 'dialog',
                label: 'Dialog 对话框'
              }, {
                value: 'tooltip',
                label: 'Tooltip 文字提示'
              }, {
                value: 'popover',
                label: 'Popover 弹出框'
              }, {
                value: 'card',
                label: 'Card 卡片'
              }, {
                value: 'carousel',
                label: 'Carousel 走马灯'
              }, {
                value: 'collapse',
                label: 'Collapse 折叠面板'
              }]
            }]
          },
            {
            value: 'ziyuan',
            label: '资源',
            children: [
                {
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          },
            {
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [
                  {
                    value: 'yizhi',
                    label: '一致'
                  },
                  {
                    value: 'fankui',
                    label: '反馈'
                  },
                  {
                    value: 'xiaolv',
                    label: '效率'
                  }, {
                    value: 'kekong',
                    label: '可控'
                  }
                ]
              },
                {
                  value: 'daohang',
                  label: '导航',
                  children: [
                    {
                      value: 'cexiangdaohang',
                      label: '侧向导航'
                    }, {
                      value: 'dingbudaohang',
                      label: '顶部导航'
                    }]
                }]
            },
            {
              value: 'zujian',
              label: '组件',
              children: [
                {
                  value: 'basic',
                  label: 'Basic',
                  children: [
                    {
                      value: 'layout',
                      label: 'Layout 布局'
                    }, {
                      value: 'color',
                      label: 'Color 色彩'
                    }, {
                      value: 'typography',
                      label: 'Typography 字体'
                    }, {
                      value: 'icon',
                      label: 'Icon 图标'
                    }, {
                      value: 'button',
                      label: 'Button 按钮'
                    }]
                }, {
                  value: 'form',
                  label: 'Form',
                  children: [
                    {
                      value: 'radio',
                      label: 'Radio 单选框'
                    }, {
                      value: 'checkbox',
                      label: 'Checkbox 多选框'
                    }, {
                      value: 'input',
                      label: 'Input 输入框'
                    }, {
                      value: 'input-number',
                      label: 'InputNumber 计数器'
                    }, {
                      value: 'select',
                      label: 'Select 选择器'
                    }, {
                      value: 'cascader',
                      label: 'Cascader 级联选择器'
                    }, {
                      value: 'switch',
                      label: 'Switch 开关'
                    }, {
                      value: 'slider',
                      label: 'Slider 滑块'
                    }, {
                      value: 'time-picker',
                      label: 'TimePicker 时间选择器'
                    }, {
                      value: 'date-picker',
                      label: 'DatePicker 日期选择器'
                    }, {
                      value: 'datetime-picker',
                      label: 'DateTimePicker 日期时间选择器'
                    }, {
                      value: 'upload',
                      label: 'Upload 上传'
                    }, {
                      value: 'rate',
                      label: 'Rate 评分'
                    }, {
                      value: 'form',
                      label: 'Form 表单'
                    }]
                }, {
                  value: 'data',
                  label: 'Data',
                  children: [
                    {
                      value: 'table',
                      label: 'Table 表格'
                    }, {
                      value: 'tag',
                      label: 'Tag 标签'
                    }, {
                      value: 'progress',
                      label: 'Progress 进度条'
                    }, {
                      value: 'tree',
                      label: 'Tree 树形控件'
                    }, {
                      value: 'pagination',
                      label: 'Pagination 分页'
                    }, {
                      value: 'badge',
                      label: 'Badge 标记'
                    }]
                }, {
                  value: 'notice',
                  label: 'Notice',
                  children: [
                    {
                      value: 'alert',
                      label: 'Alert 警告'
                    }, {
                      value: 'loading',
                      label: 'Loading 加载'
                    }, {
                      value: 'message',
                      label: 'Message 消息提示'
                    }, {
                      value: 'message-box',
                      label: 'MessageBox 弹框'
                    }, {
                      value: 'notification',
                      label: 'Notification 通知'
                    }]
                }, {
                  value: 'navigation',
                  label: 'Navigation',
                  children: [
                    {
                      value: 'menu',
                      label: 'NavMenu 导航菜单'
                    }, {
                      value: 'tabs',
                      label: 'Tabs 标签页'
                    }, {
                      value: 'breadcrumb',
                      label: 'Breadcrumb 面包屑'
                    }, {
                      value: 'dropdown',
                      label: 'Dropdown 下拉菜单'
                    }, {
                      value: 'steps',
                      label: 'Steps 步骤条'
                    }]
                }, {
                  value: 'others',
                  label: 'Others',
                  children: [
                    {
                      value: 'dialog',
                      label: 'Dialog 对话框'
                    }, {
                      value: 'tooltip',
                      label: 'Tooltip 文字提示'
                    }, {
                      value: 'popover',
                      label: 'Popover 弹出框'
                    }, {
                      value: 'card',
                      label: 'Card 卡片'
                    }, {
                      value: 'carousel',
                      label: 'Carousel 走马灯'
                    }, {
                      value: 'collapse',
                      label: 'Collapse 折叠面板'
                    }]
                }]
            },
            {
              value: 'ziyuan',
              label: '资源',
              children: [
                {
                  value: 'axure',
                  label: 'Axure Components'
                }, {
                  value: 'sketch',
                  label: 'Sketch Templates'
                }, {
                  value: 'jiaohu',
                  label: '组件交互文档'
                }]
            },
            {
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [
                  {
                    value: 'yizhi',
                    label: '一致'
                  },
                  {
                    value: 'fankui',
                    label: '反馈'
                  },
                  {
                    value: 'xiaolv',
                    label: '效率'
                  }, {
                    value: 'kekong',
                    label: '可控'
                  }
                ]
              },
                {
                  value: 'daohang',
                  label: '导航',
                  children: [
                    {
                      value: 'cexiangdaohang',
                      label: '侧向导航'
                    }, {
                      value: 'dingbudaohang',
                      label: '顶部导航'
                    }]
                }]
            },
            {
              value: 'ziyuan',
              label: '资源',
              children: [
                {
                  value: 'axure',
                  label: 'Axure Components'
                }, {
                  value: 'sketch',
                  label: 'Sketch Templates'
                }, {
                  value: 'jiaohu',
                  label: '组件交互文档'
                }]
            },
            {
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [
                  {
                    value: 'yizhi',
                    label: '一致'
                  },
                  {
                    value: 'fankui',
                    label: '反馈'
                  },
                  {
                    value: 'xiaolv',
                    label: '效率'
                  }, {
                    value: 'kekong',
                    label: '可控'
                  }
                ]
              },
                {
                  value: 'daohang',
                  label: '导航',
                  children: [
                    {
                      value: 'cexiangdaohang',
                      label: '侧向导航'
                    }, {
                      value: 'dingbudaohang',
                      label: '顶部导航'
                    }]
                }]
            },

          ],

        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        CategoriesList:[],
        total:0,
        //添加商品分类对话框显示与隐藏
        categoriesdialogVisible:false,
        //添加商品数据
        categoriesForm:{
          cat_name:'',
          cat_pid:0,
          cat_level: 0
        },
        //选定的父级
        selectekeys:[],
        //指定级联配置对象
        cateProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
          checkStrictly:'true'
        },
        //父级分类
        parentCatelist:[],
        //商品分类验证
        categoriesRules:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        //指定列的定义
        columns:[
          {
            label: '商品名称',
            prop: 'cat_name',

          },
          {
            label: '是否有效',
            type: 'template',
            template: 'likes',

          },
          {
            label: '排序',
            type: 'template',
            template: 'level',

          },
          {
            label: '操作',
            minWidth:"190px",
            type: 'template',
            template: 'operation',
          },
         ]
      }
    },
    created(){
      this.getCategoriesList()
    },
    methods:{
      async getCategoriesList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status!==200)return $this.message.error(res.meta.msg)
        this.CategoriesList = res.data.result
        //总数据
        this.total = res.data.total
        //console.log(this.CategoriesList);
      },
      handleSizeChange(newSize){  //newSize每页条数量
        this.queryInfo.pagesize = newSize
        this.getCategoriesList()
      },
      handleCurrentChange(newPage){ //newPage页码数
        this.queryInfo.pagenum = newPage
        this.getCategoriesList()
      },
      //添加分类
      CategoriesClick(){
        this.getCategories()
        this.categoriesdialogVisible = true
      },
      //点击确定，添加分类
      addCategories(){
        this.$refs.ruleForm.validate(async vaild=>{
          if(!vaild)return
          const {data:res} = await this.$http.post('categories',this.categoriesForm)
          if(res.meta.status!==201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          console.log(res);
          this.getCategoriesList()
          this.categoriesdialogVisible = false
        })
      },
      //选定的父级分类改变时触发
      handleChange(){
        var len =this.selectekeys.length
        this.categoriesForm.cat_level = len
        this.selectekeys.length>0? this.categoriesForm.cat_pid = this.selectekeys[len-1] : this.categoriesForm.cat_pid = 0
        console.log(this.selectekeys);
        console.log(this.categoriesForm.cat_pid);
        console.log(this.categoriesForm.cat_level);
      },
      //获取父级分类
      async getCategories(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200)return $this.message.error(res.meta.msg)
        this.parentCatelist = res.data
        //console.log(this.options);
        //console.log(this.parentCatelist);

      },
      //关闭添加分类对话框
      closeDialog(){
        this.$refs.ruleForm.resetFields()
        this.selectekeys = []
        this.categoriesForm.cat_level = 0
        this.categoriesForm.cat_pid = 0
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
    margin-bottom: 20px;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .el-cascader{
    width: 100%;
  }
</style>