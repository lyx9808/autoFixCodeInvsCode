import store from "@/store";
let dicts = store.getters.dict;
let params = store.getters.systemParam;
let color = {
    // 发布状态： 0 未发布；  1 已发布
    publish_status: [
        { dictValue: "1", color: "#67C23A" },
        { dictValue: "0", color: "#E6A23C" },
    ],
    // 发布状态： 1 审核不通过；  2 审核通过；3 未审核
    audit_status: [
        { dictValue: "0", color: "#2d8cf0" },
        { dictValue: "1", color: "#f16643" },
        { dictValue: "2", color: "#67C23A" },
        { dictValue: "3", color: "#E6A23C" },
    ],
    //工作人员状态： 0 冻结  1 正常
    account_status: [
        { dictValue: "1", color: "#67C23A" },
        { dictValue: "0", color: "#f16643" },
    ],
    //项目状态： 1   1 正常
    project_status: [
        { dictValue: "1", color: "#67C23A" },
        { dictValue: "0", color: "#E6A23C" },
        { dictValue: "2", color: "#f16643" },
    ],
    //项目状态： 1  0 未开票 1已开票 2 已取消
    invoice_status: [
        { dictValue: "0", color: "#E6A23C" },
        { dictValue: "1", color: "#67C23A" },
        { dictValue: "2", color: "#f16643" },
    ],
};
const filters = {
    /* 获取某个字典的list */
    dictFilter: function (key, value, label) {
        let dictList = [];
        let dictItem = {};
        dicts = store.getters.dict;
        if (dicts[key] && dicts[key].length > 0) {
            if (value || label) {
                dicts[key].forEach((item) => {
                    dictItem = {};
                    dictItem[value ? value : "dictValue"] = item.dictValue;
                    dictItem[label ? label : "dictLabel"] = item.dictLabel;
                    dictItem["status"] = item.status;
                    dictList.push(dictItem);
                });
            } else {
                dictList = dicts[key];
            }
            return dictList;
        } else {
            return "";
        }
    },
    /* 通过字典值获取对应文字 */
    dictTextFilter: function (value, key) {
        dicts = store.getters.dict;
        if (dicts[key] && dicts[key].length > 0 && dicts[key].find((item) => item.dictValue == value)) {
            return dicts[key].find((item) => item.dictValue == value).dictLabel;
        } else {
            return "";
        }
    },
    /* 通过字典值获取对应颜色 TODO */
    dictColorFilter: function (value, key) {
        // if(dicts[key] && dicts[key].length>0 && dicts[key].find(item=>item.dictValue==value)){
        //   return dicts[key].find(item=>item.dictValue==value).color;
        // }
        // else{
        //   return '';
        // }
        if (color[key] && color[key].length > 0 && color[key].find((item) => item.dictValue == value)) {
            return color[key].find((item) => item.dictValue == value).color;
        } else {
            return "";
        }
    },
    /* 系统参数 */
    systemParamFilter: function (key) {
        params = store.getters.systemParam;
        return params[key] ? params[key] : "";
    },
    /* 时间转化 new Date() =>  yyyy-MM-dd HH:mm:ss*/
    dateTimeFilter(dateTime) {
        let now = dateTime ? new Date(dateTime) : new Date();
        let date = now.toLocaleDateString().split("/");
        // 日期补零
        date.forEach((item, index) => {
            if (item < 10) date[index] = "0" + item;
        });
        return date.join("-") + " " + now.toTimeString().split(" ")[0];
    },
    /* 一些特殊的中文字符转义后替换 */
    replaceEscape(html) {
        if (!html) {
            return "";
        } else {
            let realHtml = JSON.parse(JSON.stringify(html));
            let regs = [
                { reg: /&ldquo;/g, symbolStr: "“" },
                { reg: /&rdquo;/g, symbolStr: "”" },
                { reg: /&mdash;/g, symbolStr: "—" },
                { reg: /&middot;/g, symbolStr: "·" },
                { reg: /&hellip;/g, symbolStr: "…" },
                { reg: /&lsquo;/g, symbolStr: "‘" },
                { reg: /&rsquo;/g, symbolStr: "’" },
                { reg: /&acute;/g, symbolStr: "´" },
                { reg: /&laquo;/g, symbolStr: "«" },
                { reg: /&raquo;/g, symbolStr: "»" },
                { reg: /&lsaquo;/g, symbolStr: "‹" },
                { reg: /&rsaquo;/g, symbolStr: "›" },
                { reg: /&brvbar;/g, symbolStr: "¦" },
                { reg: /&iexcl;/g, symbolStr: "¡" },
                { reg: /&uml;/g, symbolStr: "¨" },
                { reg: /&macr;/g, symbolStr: "¯" },
                { reg: /&iquest;/g, symbolStr: "¿" },
                { reg: /&deg;/g, symbolStr: "°" },
                { reg: /&sect;/g, symbolStr: "§" },
                { reg: /&copy;/g, symbolStr: "©" },
                { reg: /&reg;/g, symbolStr: "®" },
                { reg: /&trade;/g, symbolStr: "™" },
            ];
            regs.forEach((item) => {
                realHtml = realHtml.replace(item.reg, item.symbolStr);
            });
            return realHtml;
        }
    },
};

export default filters;
