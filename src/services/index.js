import axios from "axios";
import { errorMsg } from "@/utils/msg";
import { stringify, paramsFilter } from "@/utils/helper";

const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 20000,
});

// axios初始化配置
api.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
api.defaults.transformRequest = (data) => {
    return stringify(data, true);
};

// 请求拦截
api.interceptors.request.use((config) => {
    if (window._devtoolOpenFlag) {
        // 链路跟踪
        config.headers["X-B3-Flags"] = 1;
        config.headers.b3 = 1;
    }
    return config;
});

// 返回状态拦截
api.interceptors.response.use(
    (response) => {
        const { data, config } = response;
        if (data.success || config.ignoreInnerStatus) {
            return Promise.resolve(data);
        } else {
            // inner code handler
            if (data.code === 1415) {
                errorMsg(data.msg || "登录已过期，请重新登录！");
                window.location.href = "/login.html";
            } else if (data.code === 1404) {
                errorMsg(data.msg || "登录验证失败，请重新登录！");
                window.location.href = "/login.html";
            } else if (data.code === 500) {
                // 默认的错误提示
                errorMsg("系统繁忙，请稍后重试！");
            } else {
                errorMsg(data.msg);
            }
            return Promise.reject(data);
        }
    },
    (error) => {
        console.error(error.response);
        if (/timeout\sof\s\d+ms\sexceeded/.test(error.message)) {
            // 超时
            errorMsg("当前网络异常，请检查网络连接！");
        } else if (error.response) {
            switch (error.response.status) {
                // http status handler
                case 400: // 客户端请求有误
                    errorMsg("页面访问失败，请与管理员联系！");
                    break;
                case 401: // 未授权
                case 403: // 禁止访问
                    errorMsg("请与管理员联系，以确认您是否具有访问权限");
                    break;
                case 404: // 找不到
                    errorMsg("访问的资源不存在，请稍后重试！");
                    break;
                case 500: // 服务器内部错误
                    errorMsg("系统繁忙，请稍后重试！");
                    break;
                case 502: // bad gateway
                case 503: // service unavailable
                case 504: // gateway timeout
                    errorMsg("服务器维护中，请稍后重试！");
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error.response);
    }
);

export class ApiService {
    constructor(context, feature) {
        this.context = context; // 上下文
        this.feature = feature; // 特性
    }

    // get请求
    $get(action, params, config = {}) {
        return api.get(`/${this.context}/${this.feature}/${action}`, {
            ...config,
            params: paramsFilter(params, [], true),
        });
    }

    // delete请求
    $del(action, params, config = {}) {
        return api.delete(`/${this.context}/${this.feature}/${action}`, {
            ...config,
            params: paramsFilter(params, [], true),
        });
    }

    // post请求
    $post(action, params, config = {}) {
        return api.post(`/${this.context}/${this.feature}/${action}`, paramsFilter(params), config);
    }

    // post application/json请求
    $postJson(action, params, config = {}) {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data) => JSON.stringify(data),
        };
        return this.$post(action, params, { ...defaultConfig, ...config });
    }

    // 上传请求，formdata
    $upload(
        action,
        params,
        config = {
            headers: { "Content-Type": "multipart/form-data" },
            transformRequest: null,
        }
    ) {
        return api.post(`/${this.context}/${this.feature}/${action}`, params, config);
    }

    // put请求
    $put(action, params, config = {}) {
        return api.put(`/${this.context}/${this.feature}/${action}`, paramsFilter(params), config);
    }

    // put application/json请求
    $putJson(action, params, config = {}) {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data) => JSON.stringify(data),
        };
        return this.$put(action, params, { ...defaultConfig, ...config });
    }
}
