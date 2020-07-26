import Vue from 'vue'
import VueRouter from 'vue-router'

const Longin = ()=>import("components/comment/login")
const Home = () =>import("views/home")
const Welcome = () =>import("views/welcome")
const UserList = () =>import("views/homeChildren/userlist")
//权限
const propertyList = () =>import("views/homeChildren/roles/propertylist")
const roleList = () =>import("views/homeChildren/roles/rolelist")
//商品
const Goods = () =>import("views/homeChildren/cate/goods")
const Params = () =>import("views/homeChildren/cate/params")
const Categories = () =>import("views/homeChildren/cate/categories")
//订单管理
const Orders = () =>import("views/homeChildren/orders/orders")
//数据统计
const Reports = () =>import("views/homeChildren/reports/reports")

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

  const routes = [
    {
      path:"/",
      redirect:"/login",
      component:Longin
    },
    {
      path:"/login",
      component:Longin,
      meta:{
        title:"登录"
      },
    },
    {
      path:"/home",
      component:Home,
      redirect:'/welcome',
      meta:{
        title:"首页"
      },
      children:[
        {
          path:'/welcome',
          component:Welcome,
          meta:{
            title:"首页"
          },
        },
          //用户列表
        {
          path:'/users',
          component:UserList,
          meta:{
            title:"用户"
          },
        },
          //权限列表
        {
          path:'/rights',
          component:propertyList,
          meta:{
            title:"权限"
          },
        },
          //角色列表
        {
          path:'/roles',
          component:roleList,
          meta:{
            title:"角色"
          },
        },
          //商品列表
        {
          path:'/goods',
          component:Goods,
          meta:{
            title:"商品"
          },
        },
          //商品参数
        {
          path:'/params',
          component:Params,
          meta:{
            title:"参数"
          },
        },
          //商品分类
        {
          path:'/categories',
          component:Categories,
          meta:{
            title:"商品分类"
          },
        },
          //订单管理
        {
          path:'/orders',
          component:Orders,
          meta:{
            title:"订单"
          },
        },
          //数据统计
        {
          path:'/reports',
          component:Reports,
          meta:{
            title:"数据"
          },
        }
      ]
    },


]

const router = new VueRouter({
  routes,
  mode:'history'
})

router.beforeEach(function (to,from,next) {
  //页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  //若访问的是登录页面，直接next()
  if(to.path=='/login') return next();
  //若不是登录页面.则查看是否已登录，获取token值检验,若已经登录则token被保存在了window.sessionStorage
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/login')
  next()
})


export default router
