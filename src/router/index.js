import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '@/components/user/users'
import Rights from '@/components/power/rights'
import Roles from '@/components/power/roles'
import Products from '@/components/product/products'
import Params from '@/components/product/params'
import Category from '@/components/product/category'

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
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                name: 'welcome',
                component: Welcome
            },
            // 用户管理
            {
                path: '/users',
                name: 'users',
                component: Users
            },
            // 权限管理
            {
                path: '/rights',
                name: 'rights',
                component: Rights
            },
            {
                path: '/roles',
                name: 'roles',
                component: Roles
            },
            // 商品管理
            {
                path: '/goods',
                name: 'goods',
                component: Products
            },
            {
                path: '/params',
                name: 'params',
                component: Params
            },
            {
                path: '/categories',
                name: 'categories',
                component: Category
            }

        ]
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