import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () =>
        //     import ( /* webpackChunkName: "about" */ '../views/About.vue')
        component: Login
    }, {
        path: '/home',
        name: 'home',
        component: Home
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next() 放行     next('/login') 强制跳转
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()

})

export default router