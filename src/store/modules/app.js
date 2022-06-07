import Vue from "vue";
import storage from "@/utils/storage";
import cmsService from "@/services/cms";

export default {
    state: {
        contentHeight: "", // 页面中除去顶部的内容高度，包括除去标签的。
        tagsNavList: "", //标签导航数组
        breadCrumbList: "", //面包屑数组
        loginLabel: "", //登录标识，追加路由时使用，刷新将会被清空
        systemParam: "", //系统参数
        dict: {}, //数据字典
        systemInfo: "", //系统信息
    },
    getters: {
        systemParam: (state) => {
            if (storage.getToken() && state.systemParam) {
                return storage.getSystemParam();
            } else {
                return state.systemParam;
            }
        },
        dict: (state) => {
            if (storage.getToken() && state.dict) {
                return storage.getDict();
            } else {
                return state.dict;
            }
        },
        systemInfo: (state) => {
            if (state.systemParam) {
                return state.systemInfo;
            } else {
                return storage.getSystemInfo();
            }
        },
    },
    mutations: {
        setContentHeight(state, contentHeight) {
            if (contentHeight) {
                state.contentHeight = contentHeight;
                storage.setContentHeight(contentHeight);
            } else {
                state.contentHeight = storage.getContentHeight();
            }
        },
        setTagsNav(state, tagsNav) {
            if (tagsNav) {
                state.tagsNavList = JSON.stringify(tagsNav);
                storage.setTagsNavList(tagsNav);
            } else {
                state.tagsNavList = storage.getTagsNavList();
            }
        },
        // 通过标签导航的改变 新增或者刷新标签导航数组
        setNewTag(state, route) {
            let tagsNav = JSON.parse(state.tagsNavList);
            const tagIndex = tagsNav.findIndex((v) => v.name == route.name);
            if (tagIndex < 0) {
                if (route.name === "home") tagsNav.unshift(route);
                else tagsNav.push(route);
                state.tagsNavList = JSON.stringify(tagsNav);
            } else {
                tagsNav[tagIndex].params = route.params;
                tagsNav[tagIndex].meta = route.meta;
                state.tagsNavList = JSON.stringify(tagsNav);
            }
            storage.setTagsNavList(tagsNav);
        },
        setBreadCrumb(state, breadCrumb) {
            if (breadCrumb) {
                state.breadCrumbList = JSON.stringify(breadCrumb);
                storage.setBreadCrumbList(breadCrumb);
            } else {
                state.breadCrumbList = storage.getBreadCrumbList();
            }
        },
        setLoginLabel(state, loginLabel) {
            state.loginLabel = loginLabel;
        },
        setSystemParam(state, systemParam) {
            if (systemParam) {
                state.systemParam = systemParam;
                storage.setSystemParam(systemParam);
            } else {
                state.systemParam = storage.getSystemParam();
            }
        },
        setDict(state, dict) {
            if (dict) {
                state.dict = dict;
                storage.setDict(dict);
            } else {
                state.dict = storage.getDict();
            }
        },
        setSystemInfo(state, systemInfo) {
            if (systemInfo) {
                state.systemInfo = systemInfo;
                storage.setSystemInfo(systemInfo);
            } else {
                state.systemInfo = storage.getSystemInfo();
            }
        },
    },
    actions: {
        getSystemParam({ commit }) {
            return new Promise((resolve) => {
                Vue.prototype.$_api.common.paramSelect().then((res) => {
                    commit("setSystemParam", res.data);
                    storage.setSystemParam(res.data);
                    resolve();
                });
            });
        },
        getDict({ commit }) {
            return new Promise((resolve) => {
                Vue.prototype.$_api.common.dict().then((res) => {
                    commit("setDict", res);
                    storage.setDict(res);
                    resolve();
                });
            });
        },
        getSystemInfo({ commit }) {
            return new Promise((resolve) => {
                cmsService.settings().then((res) => {
                    commit("setSystemInfo", res.data);
                    document.title = res.data && res.data.basic && res.data.basic.title ? res.data.basic.title : "信息管理系统";
                    storage.setSystemInfo(res.data);
                    resolve();
                });
            });
        },
    },
    modules: {},
};
