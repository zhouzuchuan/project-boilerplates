import Vue from 'vue'
import modelRedux from 'model-redux'
import apiManage from 'api-manage'
import nprogress from 'nprogress'

import appModel from '@m/app.js'
import router from './router'
import App from './App.vue'

const { store, registerModel } = modelRedux.create()

Vue.prototype.dispatch = store.dispatch

registerModel(appModel)

// register global progress.
const whiteList = ['/login', '/authredirect'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    nprogress.start() // 开启Progress
    if (true) {
        // 判断是否有token
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            nprogress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
})

router.afterEach(() => {
    nprogress.done() // 结束Progress
})

// 注入api
Vue.prototype.$service = apiManage.init({
    list: require('@/api'),
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
