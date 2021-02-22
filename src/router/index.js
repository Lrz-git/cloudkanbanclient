// import { NULL } from 'node-sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)

//等待被动态添加的二级菜单路由
const userInfoRule = {
    path: 'userInfo',
    name: '用户信息',
    mate: {
        title: '用户信息'
    },
    component: () => import('../views/UserInfo/UserInfo.vue')
}
const powerInfoRule = {
    path: 'powerInfo',
    name: '权限设置',
    mate: {
        title: '权限设置'
    },
    component: () => import('../views/PowerInfo/PowerInfo.vue')
}
const workShopInfoRule = {
    path: 'workShopInfo',
    name: '车间信息',
    mate: {
        title: '车间信息'
    },
    component: () => import('../views/WorkShopInfo/WorkShopInfo.vue')
}
const lineInfoRule = {
    path: 'lineInfo',
    name: '产线信息',
    mate: {
        title: '产线信息'
    },
    component: () => import('../views/LineInfo/LineInfo.vue')
}
const productInfoRule = {
    path: 'productInfo',
    name: '产品管理',
    mate: {
        title: '产品管理'
    },
    component: () => import('../views/ProductInfo/ProductInfo.vue')
}
const badTypeRule = {
    path: 'badType',
    name: '不良类型',
    mate: {
        title: '不良类型'
    },
    component: () => import('../views/BadType/BadType.vue')
}
const alarmTypeRule = {
    path: 'alarmType',
    name: '异常类型',
    mate: {
        title: '异常类型'
    },
    component: () => import('../views/AlarmType/AlarmType.vue')
}
const countInfoRule = {
    path: 'countInfo',
    name: '计数方案',
    mate: {
        title: '计数方案'
    },
    component: () => import('../views/CountInfo/CountInfo.vue')
}
const shiftRule = {
    path: 'shift',
    name: '生产班次',
    mate: {
        title: '生产班次'
    },
    component: () => import('../views/Shift/Shift.vue')
}
const monitorRule = {
    path: 'monitor',
    name: '生产监控',
    mate: {
        title: '生产监控'
    },
    component: () => import('../views/Monitor/Monitor.vue')
}
const planInfoRule = {
    path: 'planInfo',
    name: '计划管理',
    mate: {
        title: '计划管理'
    },
    component: () => import('../views/PlanInfo/PlanInfo.vue')
}
const reportInfoRule = {
    path: 'reportInfo',
    name: '生产报表',
    mate: {
        title: '生产报表'
    },
    component: () => import('../views/ReportInfo/ReportInfo.vue')
}
const alarmReportRule = {
    path: 'alarmReport',
    name: '异常记录',
    mate: {
        title: '异常记录'
    },
    component: () => import('../views/AlarmReport/AlarmReport.vue')
}

//动态添加路由的时候,用于判断是否存在该权限
const ruleMapping = {
    'userInfo': userInfoRule,
    'powerInfo': powerInfoRule,
    'workShopInfo': workShopInfoRule,
    'lineInfo': lineInfoRule,
    'productInfo': productInfoRule,
    'badType': badTypeRule,
    'alarmType': alarmTypeRule,
    'countInfo': countInfoRule,
    'shift': shiftRule,
    'monitor': monitorRule,
    'planInfo': planInfoRule,
    'reportInfo': reportInfoRule,
    'alarmReport': alarmReportRule,
}

const routes = [{
    // 根目录
    path: '/',
    // 路由重定向
    redirect: 'Login'
},
{
    path: '/login',
    name: 'Login',
    mate: {
        name: "登录"
    },
    component: () => import('../views/Login.vue')
},
{
    path: '/layout',
    name: 'Layout',
    redirect: "/layout/Home", //定向
    component: () => import('../views/Layout/Layout.vue'),
    children: [{
        path: 'home',
        name: '首页',
        mate: {
            name: "首页"
        },
        component: () => import('../views/Home/Home.vue')
    }]
}
]

const router = new VueRouter({
    routes
})

//路由发生变化会经过此函数, to即将要进入的目标路由对象, from当前导航正要离开的路由, next允许跳转的方法, 需要主动调用
router.beforeEach((to, from, next) => {
    //   console.log(to);
    store.commit('editableTabsAdd', {
        path: to.path,
        meta: {
            name: to.name
        }
    })
    store.commit('editableTabsActive', to.path)
    // console.log(userInfoVuex);
    if (to.path == '/Login') {
        next();
        const userInfoVuex = store.state.userInfo;
        if (userInfoVuex.length > 0) {
            //清空sessionStorage的数据
            sessionStorage.clear();
            //清空vuex数据
            window.location.reload()
        }
    } else {
        // 从sessionStorage取用户信息,如果为空,代表尚未登录
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo != null) {
            next();
        } else {
            next('/Login');
        }
    }
})

//根据二级权限,对路由进行动态添加
export function initDynamicRoutes () {
    const currentRoute = router.options.routes;
    // 找到Layout,对Layout的children进行添加
    const menuList = store.state.rightList;
    // 遍历二级权限
    menuList.forEach(item => {
        item.childMenuList.forEach(item => {
            const temp = ruleMapping[item.pageUrl_BS];
            currentRoute[2].children.push(temp);
        })
    })
    router.addRoutes(currentRoute) //添加路由
}

export default router
