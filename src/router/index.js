import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import storage from "@/utils/storage";
import { Loading } from "element-ui";

const routerContext = require.context("./", true, /\.js/);
let routes = [];
let routerModule;
// 按需加载路由即根据权限添加需要的路由,仅默认的路由
// 整合所有的默认路由
for (const route of routerContext.keys()) {
    if (route === "./index.js") continue;
    routerModule = routerContext(route);
    routes = [...routes, ...(routerModule.default || routerModule)];
}

Vue.use(VueRouter);

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((error) => error);
};
/* 
  {
    path:'',
    name:'',
    hidden: false,//在左侧菜单中不展示的，默认不写
    meta:{
      title:'',//路由的名称
      icon:'',//图标，对应UI框架中的图标
      isDefault:false,//是否是路由中的白名单，默认不写,仅本地的路由会有
      notCache:false,//设置为true时页面将不缓存,默认不写
    }
  } 
*/

const router = new VueRouter({
    base: "/" + process.env.VUE_APP_PREFIX + "/",
    mode: "history",
    routes,
});

// const menuList = [];
let otherRouter = [];
let loading = null;
let token = storage.getToken();
router.beforeEach((to, from, next) => {
    loading = Loading.service({
        lock: true,
        text: "加载中...",
    });
    if (!storage.getSystemInfo()) {
        store.dispatch("getSystemInfo");
    }
    // 在没有请求到路由文件，且登录过时去获取路由
    if (!store.state.app.loginLabel && storage.getToken()) {
        store.state.app.loginLabel = new Date().getTime();
        Vue.prototype.$_api.common.routers().then((resp) => {
            // resp.data = dealRouters(resp.data);
            otherRouter = otherRouter.concat(resp.data);
            dealRouter(to, next);
        });
    } else {
        goPage(to, next);
    }
});
router.afterEach(() => {
    loading.close();
    window.scrollTo(0, 0);
});

// 刷新页面后追加获取的路由，非登陆时
function dealRouter(to, next) {
    // 拼接了路由之后，清空缓存登录后跳转不进去,故在登陆处也有添加
    router.options.routes = router.options.routes.concat(otherRouter);
    routes = router.options.routes;
    router.addRoutes(otherRouter);
    goPage(to, next);
}

// 处理跳转
function goPage(to, next) {
    token = storage.getToken();
    let tagsNavList = storage.getTagsNavList();
    let toPath = to.path ? to.path.slice(1) : "";
    if (toPath.indexOf("/") > -1) {
        toPath = toPath.slice(0, toPath.indexOf("/"));
    }
    if (!token && to.name !== "login" && to.name !== "_login") {
        // 未登录且要跳转的页面不是登录页
        next({
            name: "login", // 跳转到登录页
        });
    }
    // else if (!to.isDefault && to.meta.auth && menuList.length>0 && menuList.indexOf(to.meta.auth)<0) {// 没有权限的路由
    //   next({
    //     path: "/403",
    //   })
    //   return;
    // }
    else if (!to.name && toPath != "/" && tagsNavList && tagsNavList.length && tagsNavList.find((item) => item.name == toPath)) {
        // 进入了未定义的路由
        let tagsNavActive = tagsNavList.find((item) => item.name == toPath);
        next({
            name: toPath, // 跳转到上一次的活跃导航标签，在页面刷新时避免活跃导航标签是动态路由而找不到
            query: tagsNavActive.query,
            params: tagsNavActive.params,
        });
        return;
    } else if (!to.name) {
        // 进入了未定义的路由
        next({
            path: "/404",
        });
        return;
    } else {
        next();
    }
}

export default router;
