import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Home'),
    children: [
      {
        path: '/',
        component: () => import('../views/Index/Index')
      },
      {
        path: '/personal',
        name: 'personal',
        component: () => import('../views/PersonalCenter/PersonalCenter')
      },
      {
        path: '/detail',
        name: 'detail',
        component: () => import('../views/Article/Detail/ArticleDetail')
      },
      {
        path: '/collection',
        name: 'collection',
        component: () => import('../views/PersonalCenter/Collection/Collection')
      },
      {
        path: '/user/setting',
        name: 'setting',
        component: () => import('../views/PersonalCenter/ProfileSetting/ProfileSetting')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('../views/Article/SearchArticles')
      }
    ]
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('../views/Article/Publish/PublishMD')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About/About')
  }
]

const router = new VueRouter({
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  // 取出token，token在用户完成登录时会存储倒localStorage
  const token = window.localStorage.getItem('token')
  // 如果是访问需要权限
  if (to.name === 'publish' || to.name === 'setting') {
    if (!token) {
      return next('/')
    }
  }
  next()
})

export default router
