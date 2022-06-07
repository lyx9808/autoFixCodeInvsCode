import { setStorage, getStorage, removeStorage } from "./tool";
class Storage {
    /* token */
    setToken(value) {
        return setStorage({ key: "token", value });
    }
    getToken() {
        return getStorage({ key: "token" });
    }
    removeToken() {
        removeStorage({ key: "token" });
    }

    /* contentHeight 右侧除顶部外的实际高度 */
    setContentHeight(value) {
        setStorage({ key: "contentHeight", value });
    }
    getContentHeight() {
        return getStorage({ key: "contentHeight" });
    }
    removeContentHeight() {
        removeStorage({ key: "contentHeight" });
    }

    /* tagsNavList 导航标签数组 */
    setTagsNavList(value) {
        setStorage({ key: "tagsNavList", value, json: true });
    }
    getTagsNavList() {
        return getStorage({ key: "tagsNavList", json: true });
    }
    removeTagsNavList() {
        removeStorage({ key: "tagsNavList" });
    }

    /* breadCrumbList  面包屑*/
    setBreadCrumbList(value) {
        setStorage({ key: "breadCrumbList", value, json: true });
    }
    getBreadCrumbList() {
        return getStorage({ key: "breadCrumbList", json: true });
    }
    removeBreadCrumbList() {
        removeStorage({ key: "breadCrumbList" });
    }

    /* routerData 权限数据，是个对象包括menu(菜单)部分 */
    setRouterData(value) {
        setStorage({
            key: "routerData",
            value,
            type: "sessionStorage",
            json: true,
        });
    }
    getRouterData() {
        return getStorage({
            key: "routerData",
            type: "sessionStorage",
            json: true,
        });
    }
    removeRouterData() {
        removeStorage({ key: "routerData", type: "sessionStorage" });
    }

    /* action(操作)部分 */
    setActionData(value) {
        setStorage({
            key: "actionData",
            value,
            type: "sessionStorage",
            json: true,
        });
    }
    getActionData() {
        return getStorage({
            key: "actionData",
            type: "sessionStorage",
            json: true,
        });
    }
    removeActionData() {
        removeStorage({ key: "actionData", type: "sessionStorage" });
    }

    /* userName  用户名*/
    setUserName(value) {
        setStorage({ key: "userName", value });
    }
    getUserName() {
        return getStorage({ key: "userName" });
    }
    removeUserName() {
        removeStorage({ key: "userName" });
    }

    /* orgInfo  机构信息*/
    setOrgInfo(value) {
        setStorage({ key: "orgInfo", value, json: true });
    }
    getOrgInfo() {
        let orgInfo = getStorage({ key: "orgInfo", json: true });
        return orgInfo ? orgInfo : { orgId: "", orgName: "" };
    }
    removeOrgInfo() {
        removeStorage({ key: "orgInfo" });
    }

    /* loginType 进入页面具体属于什么端 */
    setLoginType(value) {
        setStorage({ key: "loginType", value });
    }
    getLoginType() {
        return getStorage({ key: "loginType" });
    }
    removeLoginType() {
        removeStorage({ key: "loginType" });
    }

    /* tableColumns 列表的列的展示与隐藏 */
    setTableColumns(value) {
        setStorage({ key: "tableColumns", value, json: true });
    }
    getTableColumns() {
        return getStorage({ key: "tableColumns", json: true });
    }
    removeTableColumns() {
        removeStorage({ key: "tableColumns" });
    }

    /* systemParam 系统参数 */
    setSystemParam(value) {
        setStorage({ key: "systemParam", value, json: true });
    }
    getSystemParam() {
        return getStorage({ key: "systemParam", json: true });
    }
    removeSystemParam() {
        removeStorage({ key: "systemParam" });
    }

    /* dict 数据字典 */
    setDict(value) {
        setStorage({ key: "dict", value, json: true });
    }
    getDict() {
        return getStorage({ key: "dict", json: true });
    }
    removeDict() {
        removeStorage({ key: "dict" });
    }

    /* systemInfo 系统信息 */
    setSystemInfo(value) {
        setStorage({ key: "systemInfo", value, json: true });
    }
    getSystemInfo() {
        return getStorage({ key: "systemInfo", json: true });
    }
    removeSystemInfo() {
        removeStorage({ key: "systemInfo" });
    }
}
const storage = new Storage();
export default storage;
