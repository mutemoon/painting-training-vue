import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../components/Home')
const Calculator = () => import('../views/calculator/Calculator')
const CalcBill = () => import('../views/calculator/CalcBill')
const CalcDamage = () => import('../views/calculator/CalcDamage')
const User = () => import('../components/User')
const Unknow = () => import('../components/Unknow')
const Vocabulary = () => import('../components/vocabulary/Vocabulary')
const DoubleLinesParallel = () => import('../views/painting-training/perspective/DoubleLinesParallel')
const Grammar = () => import('../views/review/Grammar')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页'
    },
  },
  {
    path: '/calculator',
    component: Calculator,
    meta: {
      title: '一些计算器'
    },
    children: [{
      path: '',
      redirect: 'calcbill'
    }, {
      path: 'calcbill',
      component: CalcBill
    }, {
      path: 'calcdamage',
      component: CalcDamage,
    }]
  },
  {
    path: '/review',
    component: Grammar,
    meta: {
      title: '复习'
    },
    children: [{
      path: '',
      redirect: 'grammar',
      meta: {
        title: "语法复习"
      }
    }, {
      path: 'grammar',
      component: Grammar,
    }, ]
  },
  {
    path: '/user/:uid',
    component: User,
    meta: {
      title: '档案'
    },
  },
  {
    path: '/vocabulary',
    component: Vocabulary,
    meta: {
      title: '记单词'
    }
  },

  {
    path: '/painting-training',
    redirect: '/painting-training/perspective/double-lines-parallel'
  },
  {
    path: '/painting-training/perspective',
    redirect: '/painting-training/perspective/double-lines-parallel'
  },
  {
    path: '/painting-training/perspective/double-lines-parallel',
    component: DoubleLinesParallel,
    meta: {
      title: '两线平行'
    }
  },

  {
    path: '*',
    component: Unknow,
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  document.title = to.matched[0].meta.title
  next()
})

export default router
