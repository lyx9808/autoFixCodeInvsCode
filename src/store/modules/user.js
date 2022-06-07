import Vue from "vue";
import storage from "@/utils/storage";

export default {
    state: {
        routerData: "", // 跟权限相关的路由信息
        downloadStatus: false, //导出任务列表状态
        userName: "", //用户名
        wsStatus: false, // websocket状态
        screen: {
            width: 0,
            height: 0,
        },
    },
    getters: {
        routerData: (state) => {
            if (storage.getToken() && (!state.routerData || !state.routerData.length)) {
                return storage.getRouterData();
            } else {
                return state.routerData;
            }
        },
    },
    mutations: {
        setRouterData(state, routerData) {
            if (routerData && routerData.length > 0) {
                state.routerData = routerData;
                storage.setRouterData(routerData);
            } else {
                state.routerData = {};
            }
        },
        setDownloadStatus(state, status) {
            state.downloadStatus = status;
        },
        setUserName(state, userName) {
            state.userName = userName;
        },
        setUserAvatarUrl(state, userAvatarUrl) {
            state.userAvatarUrl = userAvatarUrl;
        },
        setWsStatus(state, status) {
            state.wsStatus = status;
        },
        setScreenWidthHeight(state, screen) {
            state.screen = screen;
        },
    },
    actions: {
        //获取权限相关的路由信息
        getActionData({ commit }) {
            return new Promise((resolve) => {
                Vue.prototype.$_api.common.auth().then((resp) => {
                    storage.setActionData(resp.data.permissions);
                    commit("setUserAvatarUrl", resp.data.ucUser.avatarUrl);
                    commit("setUserName", resp.data.ucUser.name);
                    resolve();
                });
            });
        },
    },
    modules: {},
};
