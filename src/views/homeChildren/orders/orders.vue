<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="selectOrders" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="selectdata"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
              :data="OredersTableData"
              stripe
              border
              style="width: 100%">
        <el-table-column
                label="#"
                type="index"
                >
        </el-table-column>
        <el-table-column
                prop="order_number"
                label="订单编号"
                min-width="250"
                >
        </el-table-column>
        <el-table-column
                prop="order_price"
                label="订单价格"
                width="80"
                >
        </el-table-column>
        <el-table-column
                prop="order_pay"
                label="是否付款"
                width="80"
        >
          <template slot-scope="scopepay">
            <el-tag type="warning" v-if="scopepay.row.order_pay==0">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                prop="is_send"
                label="是否发货"
                width="80"
                >
        </el-table-column>
        <el-table-column
                label="下单时间"
                width="160"
                >
          <template slot-scope="scopetime">
            {{scopetime.row.create_time | createTime}}
          </template>
        </el-table-column>
        <el-table-column
                label="操作"
                width="130"
        >
          <template slot-scope="scopes">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button type="primary" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="ordersHandleSizeChange"
              @current-change="ordersHandleCurrentChange"
              :current-page="ordersInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="ordersInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "orders",
    data(){
      return {
        //搜索值
        selectOrders:'',
        //订单数据
        OredersTableData:[],
        //订单总数量
        total:0,
        //查询参数
        ordersInfo:{
          query:'',
          pagenum:1,
          pagesize:5,
        },
      }
    },
    filters:{
      //时间格式转换
      createTime(orederstime){
        return new Date(orederstime).toLocaleString('chinese',{hour12:false})
      },
    },
    created(){
      this.getOrederList()
    },
    methods:{
      //获取订单数据
      async getOrederList(){
        const {data:res} = await this.$http.get("orders",{
          params:this.ordersInfo
        })
        if(res.meta.status !==200)return this.$message.error(res.meta.msg)
        //this.$message.success(res.meta.msg)
        this.OredersTableData = res.data.goods
        this.total = res.data.total
        //console.log(res);
      },
      ordersHandleSizeChange(sizevalue){
        //console.log(sizevalue);
        this.ordersInfo.pagesize = sizevalue
        this.getOrederList()
      },
      ordersHandleCurrentChange(pagevalue){
        console.log(pagevalue);
        this.ordersInfo.pagenum = pagevalue
        this.getOrederList()
      },
      //搜索
      selectdata(){
        console.log(this.selectOrders);
        this.$http.get('orders',{
          params:{
            query:"itcast-g7kmck725jaujgdts",
            pagenum:1,
            pagesize:30
          }
        }).then((data=>{
          console.log(data);
        }))
        // this.OredersTableData = res.data.goods
        // this.total = res.data.total
      },
    },
  }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
</style>