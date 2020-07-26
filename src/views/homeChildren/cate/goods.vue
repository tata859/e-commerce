<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入要添加的商品" v-model="goodsquery" clearable @clear="selectGoods">
            <el-button slot="append" icon="el-icon-search" @click="selectGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="goodsList"
              stripe
              border
              style="width: 100%">
        <el-table-column
                prop="goods_name"
                label="商品名称"
                width="600"
        >
        </el-table-column>
        <el-table-column
                prop="goods_price"
                label="商品价格(元)">
        </el-table-column>
        <el-table-column
                prop="goods_number"
                label="商品数量">
        </el-table-column>
        <el-table-column
                prop="goods_number"
                label="商品重量">
        </el-table-column>
        <el-table-column
                label="创建时间"
                width="100"
        >
          <template slot-scope="scope">
            {{scope.row.add_time | filterTime}}
          </template>
        </el-table-column>
        <el-table-column
                label="操作"
                min-width="120"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top-start" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="goodsSizeChange"
              @current-change="goodsCurrentChange"
              :current-page="goodsInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="goodsInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "goods",
    data() {
      return {
        goodsInfo:{
          query:'',
          pagenum:1,
          pagesize:5
        },
        //商品列表
        goodsList:[],
        //总数
        total:0,
        //查找参数
        goodsquery:'',
      }
    },
    created(){
      this.getGoodsList()
    },
    filters:{
      //时间过滤器
      filterTime(timeValue){
        const dt = new Date(timeValue).toLocaleString('chinese',{ hour12: false })
        return dt
      },
    },
    methods: {
      //获取商品列表
      async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.goodsInfo})
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
         console.log(res);
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      //每页数量
      goodsSizeChange(pagesizevalue){
        console.log(pagesizevalue);
        this.goodsInfo.pagesize = pagesizevalue
        this.getGoodsList()
      },
      //页码
      goodsCurrentChange(pagenumvalue){
        console.log(pagenumvalue);
        this.goodsInfo.pagenum = pagenumvalue
        this.getGoodsList()
      },
      //查找商品
      selectGoods(){
        console.log(this.goodsquery);
        this.goodsInfo.query = this.goodsquery
        this.getGoodsList()
      },
      //添加商品
      addGoods(){

      },
      //删除商品
      deleteGoods(goodsItem){
        console.log(goodsItem);
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`goods/${goodsItem.goods_id}`)
          if(res.meta.status!==200)return this.$message.error(res.meta.msg)
          this.getGoodsList()
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
    }
  }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
</style>