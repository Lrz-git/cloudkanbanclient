import Vue from 'vue';
import Vuex from 'vuex';
import $router from '@/router'
import {
    tabsBMD
} from './tabsBMD'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //在此处定义rightList,等待被修改然后映射到菜单组件,并且尝试从sessionStorage获取菜单数据,因为页面刷新时vuex也会被刷新
        rightList: JSON.parse(sessionStorage.getItem('rightList') || '[]'),
        userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '[]'),
        isCollapse: sessionStorage.getItem('isCollapse') || 'true',
        // tabs
        editableTabs: JSON.parse(sessionStorage.getItem('editableTabsJSON') || '[]'),
        tabIndex: sessionStorage.getItem('tabIndexJSON') || '',
    },
    // 无需引用
    mutations: {
        //在此处定义方法,设置state中rightList的值
        setRightList (state, data) {
            state.rightList = data;
            //将菜单数据存入sessionStorage,防止页面刷新后丢失菜单数据
            sessionStorage.setItem('rightList', JSON.stringify(data));
            //   console.log(state.rightList);
        },
        setUserInfo (state, data) {
            state.userInfo = data;
            //将用户数据存入sessionStorage,防止页面刷新后丢失菜单数据
            sessionStorage.setItem('userInfo', JSON.stringify(data));
        },
        setIsCollapse (state) {
            if (state.isCollapse === 'true') {
                state.isCollapse = 'false'
            } else {
                state.isCollapse = 'true';
            }
            sessionStorage.setItem('isCollapse', state.isCollapse);
        },
        // add editableTabs
        editableTabsAdd (state, data) {
            // 排除白名单
            let boo = true;
            tabsBMD.forEach((item) => {
                if (item.path == data.path) {
                    console.log(data.path)
                    boo = false;
                }
            })
            for (let i = 0; i < state.editableTabs.length; i++) {
                if (state.editableTabs[i].path == data.path) {
                    boo = false;
                    break;
                }
            }
            if (boo) state.editableTabs.push(data)
        },
        // del editableTabs
        editableTabsDel (state, data) {
            let index = state.editableTabs.findIndex((item) => {
                return item.path == data;
            })
            if (data == '/layout/Home' && state.editableTabs.length == 1) {
                return;
            } else {
                state.editableTabs.splice(index, 1);
            }
            // 当前页面
            if (data == state.tabIndex) {
                if (!state.editableTabs[index - 1]) {
                    if (!state.editableTabs[index + 1] && !state.editableTabs[index]) {
                        if (data == '/layout/Home') return;
                        $router.push("/layout/Home");
                        return;
                    } else {
                        $router.push(state.editableTabs[index].path);
                        return;
                    }
                }
                $router.push(state.editableTabs[index - 1].path);
            }
        },
        // active editableTabs
        editableTabsActive (state, data) {
            state.tabIndex = data
        }
    },
    actions: {

    },
    getters: {

    }
})
