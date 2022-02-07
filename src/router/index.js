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
const LineLinePerpendicular = () => import('../views/painting-training/perspective/LineLinePerpendicular')
const LineLineAngulation = () => import('../views/painting-training/perspective/LineLineAngulation')

const LinePlaneParallel = () => import('../views/painting-training/perspective/LinePlaneParallel')
const LinePlanePerpendicular = () => import('../views/painting-training/perspective/LinePlanePerpendicular')
const LinePlaneAngulation = () => import('../views/painting-training/perspective/LinePlaneAngulation')

const PlanePlaneParallel = () => import('../views/painting-training/perspective/PlanePlaneParallel')
const PlanePlanePerpendicular = () => import('../views/painting-training/perspective/PlanePlanePerpendicular')
const PlanePlaneAngulation = () => import('../views/painting-training/perspective/PlanePlaneAngulation')

const SameDirectionProportion = () => import('../views/painting-training/perspective/SameDirectionProportion')
const DifferentDirectionProportion = () => import('../views/painting-training/perspective/DifferentDirectionProportion')

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
    redirect: '/painting-training/line-line-perpendicular',
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
        component: LineLineParallel,
      },
      {
        path: 'line-line-perpendicular',
        component: LineLinePerpendicular,
      },
      {
        path: 'line-line-angulation',
        component: LineLineAngulation,
      },

      {
        path: 'line-plane-parallel',
        component: LinePlaneParallel,
      },
      {
        path: 'line-plane-perpendicular',
        component: LinePlanePerpendicular,
      },
      {
        path: 'line-plane-angulation',
        component: LinePlaneAngulation,
      },

      {
        path: 'plane-plane-parallel',
        component: PlanePlaneParallel,
      },
      {
        path: 'plane-plane-perpendicular',
        component: PlanePlanePerpendicular,
      },
      {
        path: 'plane-plane-angulation',
        component: PlanePlaneAngulation,
      },

      {
        path: 'same-direction-proportion',
        component: SameDirectionProportion,
      },
      {
        path: 'same-direction-proportion',
        component: DifferentDirectionProportion,
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
