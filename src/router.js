import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import cookie from "./assets/js/cookie";

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    { //首页交易动态/公告/资讯 更多跳转
      path: '/article/:id',
      name: 'article',
      component: () => import('./views/homeMore/index.vue') //公司新闻/专业机构 更多
    },
    {
      path: '/trade/:simulate',
      component: () => import('./views/trade/'),
      children: [
        {path: '',alias: 'buy',name:'trade',component: () => import('./views/trade/buy.vue'), meta:{auth:true}},//创建策略
        {path: 'entrust',name:'entrust',component: () => import('./views/trade/entrust.vue'), meta:{auth:true}},//当前委托
        {path: 'sell',name:'sell',component: () => import('./views/trade/sell.vue'), meta:{auth:true}},//当前持仓
        {path: 'history',name:'history',component: () => import('./views/trade/history.vue'), meta:{auth:true}},//历史持仓
      ],
      meta:{auth:true}
    },
    {
      path:'/details/:id',
      name:'details',
      component: () => import('./views/trade/details'),
    },
    {
      path: '/login',
      name: 'login',
      // alias: ['/forget', '/register'],
      component: () => import('./views/login/index')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/login/register.vue')
    },
    { //手机客户端
      path: '/weixin',
      name: 'weixin',
      component: () => import('./views/weixin/weixin.vue')
    },
    { //个人中心
      path: '/user',
      name: 'user',
      component: () => import('./views/user/user'),
      meta:{auth:true},
      children: [
        { //我的资产
          path: '',
          name: 'assets',
          component: () => import('./views/user/assets'),
          meta:{auth:true}
        },
        { //充值
          path: 'topUp',
          name: 'topUp',
          component: () => import('./views/user/topUp'),
          meta:{auth:true}
          
        },
        { //提现
          path: 'withdrawal',
          name: 'withdrawal',
          component: () => import('./views/user/withdrawal'),
          meta:{auth:true}
          
        },
        { //银行卡管理
          path: 'bankCard',
          name: 'bankCard',
          component: () => import('./views/user/bankCard'),
          meta:{auth:true}
          
        },
        { //账户安全
          path: 'security',
          name: 'security',
          component: () => import('./views/user/security'),
          meta:{auth:true}
          
        },
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  let userInfo = cookie.get('_auth');

  if (to.meta.auth) { //判断需不需要登录验证
    if (userInfo) { //有没有用户信息
      next()
    } else { //没有跳到登录页
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else if (to.name === 'login') { //判断进入的地址是不是登录页
    if (userInfo) { //有没有用户信息 有就返回首页 没有就进
      next()
    } else {
      next()
    }
  } else {

    next()
  }
})

export default router