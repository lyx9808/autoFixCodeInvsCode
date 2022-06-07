import Vue from "vue";
import store from "../store";
import axios from "axios";
import router from "../router";
import storage from "@/utils/storage";

import { routeHasExist } from "@/utils";

import { Message } from "view-design";

/* 
在页面中打开新的页面,并且同时打开新的标签导航
部分参数发生改变，或者会改变他的meta中的title
route：跳转的具体参数
*/
Vue.prototype.$_openTagNav = function (route) {
    let { name, params, meta, query } = route;
    store.commit("setNewTag", { name, params, meta, query });
    router.push({ name, params, query });
};

/*
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * roundtag:舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
 * */
Vue.prototype.$_formatNumber = function (number, decimals, roundtag) {
    number = (number + "").replace(/[^0-9+-Ee.]/g, "");
    roundtag = roundtag || "ceil"; // 'ceil','floor','round'
    let n = !isFinite(+number) ? 0 : +number;
    let prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
    let sep = ",";
    let dec = ".";
    let s = "";
    let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec);
        return "" + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
};

/*
 * 判断操作权限是否存在
 */
Vue.prototype.$_has = function (authItem) {
    let authArr = storage.getActionData();
    authArr = authArr ? authArr : [];
    if (authArr && authArr.length > 0) {
        return authArr.includes(authItem);
    }
    return false;
};

/*
 * 判断目录是否存在
 */
Vue.prototype.$_hasMenu = function (menu) {
    let menuArr = storage.getRouterData().value;
    menuArr = menuArr ? menuArr : [];
    if (menuArr && menuArr.length > 0) {
        let newMenu = [];
        menuArr.map((item) => {
            newMenu.push(item.name);
            if (item.children && item.children.length > 0) {
                item.children.map((it) => {
                    newMenu.push(it.name);
                });
            }
        });
        return newMenu.includes(menu);
    }

    return false;
};

/*
 * 类详情路由的跳转
 */
Vue.prototype.$_addTag = function (route, type = "push") {
    let tagsNavList = storage.getTagsNavList();
    if (typeof route.name !== "undefined" && route.name) {
        if (!routeHasExist(tagsNavList, route)) {
            if (type === "push") tagsNavList.push(route);
            else {
                if (route.name === "home") tagsNavList.unshift(route);
                else tagsNavList.splice(1, 0, route);
            }
        } else {
            // 解决编辑ID不变问题
            // eslint-disable-next-line
        if (route.hasOwnProperty("params") && JSON.stringify(route.params != "{}")) {
                const tagIndex = tagsNavList.findIndex((v) => v.name === route.name);
                if (tagIndex && tagsNavList[tagIndex]) {
                    tagsNavList[tagIndex].params = route.params;
                }
            }
        }
        //解决标签名不变的bug
        tagsNavList.forEach((element) => {
            if (element.name === route.name) {
                element.meta.title = route.meta.title;
            }
        });
        storage.setTagsNavList([...tagsNavList]);
        router.push(route);
    }
};

/* 导出 格式csv TODO 与excel差异，是否考虑合成一个*/
Vue.prototype.$_exportCsv = function (csv, filename = "export.csv") {
    return new Promise((resolve) => {
        const blob = new Blob([csv]);
        let fileName = filename;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
        resolve("");
    });
};

/* 导出 格式excel */
Vue.prototype.$_exportXlsx = function (resp, filename = "export.xlsx") {
    return new Promise((resolve) => {
        const blob = new Blob([resp], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        const elink = document.createElement("a");
        elink.href = URL.createObjectURL(blob); //创建下载的链接
        elink.download = filename + ".xlsx"; //下载后文件名
        elink.style.display = "none";
        document.body.appendChild(elink);
        elink.click(); //点击下载
        document.body.removeChild(elink); //下载完成移除元素
        URL.revokeObjectURL(elink.href); //释放掉blob对象
        resolve("");
    });
};

/**
 *
 * @param {*} name 文件名称
 * @param {*} url 路径
 * @param {*} path 其他参数
 */
Vue.prototype.$_downloadGet = function (name, url, params, baseApi = true, headers = {}) {
    Message.warning("正在下载中...");
    url = baseApi ? process.env.VUE_APP_BASE_API + url : url;
    axios
        .get(url, {
            params,
            responseType: "arraybuffer",
            headers,
        })
        .then((res) => {
            const content = res.data;
            if (name === "") {
                let contentDisposition = res.headers["content-disposition"];
                if (contentDisposition) {
                    name = window.decodeURI(res.headers["content-disposition"].split("=")[1], "UTF-8");
                }
            }
            const blob = new Blob([content]); //构造一个blob对象来处理数据
            const fileName = name;
            //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
            //IE10以上支持blob但是依然不支持download
            if ("download" in document.createElement("a")) {
                //支持a标签download的浏览器
                const link = document.createElement("a"); //创建a标签
                link.download = fileName; //a标签添加属性
                link.style.display = "none";
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click(); //执行下载
                URL.revokeObjectURL(link.href); //释放url
                document.body.removeChild(link); //释放标签
            }
        });
};

/** * 获取屏幕宽高 */
Vue.prototype.$_getViewportSize = function () {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    };
};
