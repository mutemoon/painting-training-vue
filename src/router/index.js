import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../components/Home')
const Calculator = () => import('../views/calculator/Calculator')
const CalcBill = () => import('../views/calculator/CalcBill')
const CalcDamage = () => import('../views/calculator/CalcDamage')
const User = () => import('../components/User')
const Unknow = () => import('../components/Unknow')
const Vocabulary = () => import('../components/vocabulary/Vocabulary')
const LineLineParallel = () => import('../views/painting-training/perspective/LineLineParallel')
const PaintingTraining = () => import('../views/painting-training/PaintingTraining')
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
    component: PaintingTraining,
    meta: {
      title: '美基训练'
    },
    children: [{
        path: '',
        redirect: 'line-line-parallel'
      },
      {
        path: 'line-line-parallel',
        component: LineLineParallel
      },
    ]
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
