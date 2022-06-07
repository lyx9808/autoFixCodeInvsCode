/**
 * 判断是不是Json
 * @param {*} string
 * @returns
 */
export const isJson = (string) => {
    if (typeof string === "object") {
        return true;
    }
    if (typeof string === "string") {
        try {
            var obj = JSON.parse(string);
            if (typeof obj === "object" && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
};

/**
 * 计算数组中最大的值 + 1
 * @param {*} arr
 * @param {*} key
 * @returns
 */
export const getAutoValue = (arr, key = "") => {
    let newArr = [];
    if (key) {
        arr.map((item) => {
            newArr.push(item[key]);
        });
    } else {
        newArr = arr;
    }
    return newArr.length === 0 ? 1 : Math.max(...newArr) + 1;
};

/**
 *
 * @param {*} arr
 * @param {*} key
 * @returns
 */
export const buildOptions = (arr, key = "value") => {
    arr.map((item, index) => {
        item[key] = index + 1 + "";
    });
    return arr;
};

/**
 * 生成table中Tooltip【重写】
 * 存在render时，按传入的为准
 * @param cloumns
 */
export const rewriteTooltip = (cloumns) => {
    cloumns.map((item) => {
        if (item.tooltip && !item.render && item.key && !item.slot) {
            let placement = "";
            if (item.align === "left") {
                placement = "bottom-start";
            } else if (item.align === "right") {
                placement = "bottom-end";
            } else {
                placement = "bottom";
            }
            item.render = (h, params) => {
                return h(
                    "Tooltip",
                    {
                        style: {
                            display: "inline-grid",
                        },
                        props: {
                            placement: placement,
                            transfer: true,
                            maxWidth: "300",
                            disabled: !params.row[item.key],
                        },
                    },
                    [
                        h(
                            "div",
                            {
                                slot: "content",
                            },
                            [h("div", params.row[item.key])]
                        ),
                        h(
                            "span",
                            {
                                style: {
                                    display: "-webkit-box",
                                    textOverflow: "ellipsis",
                                    "-webkit-box-orient": "vertical",
                                    "-webkit-line-clamp": item.tooltipLine || 1, //数字代表行数，自行设置
                                    overflow: "hidden",
                                },
                            },
                            params.row[item.key] === null || params.row[item.key] === undefined || params.row[item.key] === ""
                                ? "--"
                                : params.row[item.key]
                        ),
                    ]
                );
            };
        }
        //自动填充 --
        if (!item.render && item.key && !item.slot) {
            item.render = (h, params) => {
                return h(
                    "span",
                    params.row[item.key] === null || params.row[item.key] === undefined || params.row[item.key] === ""
                        ? "--"
                        : params.row[item.key]
                );
            };
        }
    });
    return cloumns;
};

/**
 * 生成唯一标识
 * @param n 随机字符串位数
 * */
export const createRandomKey = (n = 10) => {
    let fieldKey = "",
        charStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        firstStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < n; i++) {
        let str = i == 0 ? firstStr : charStr;
        let index = Math.round(Math.random() * (str.length - 1));
        fieldKey += str.substring(index, index + 1);
    }
    return fieldKey;
};

/**
 * 获取随机全数字
 * @param n
 * @returns
 */
export const createRandomNumber = (n = 6) => {
    let num = "";
    for (let i = 0; i < n; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
};

/**
 * 自动取二维数组中的某一列值(返回String)
 * @param params
 */
export const getArrayValue = (params, key) => {
    let arr = [];
    params.map((item) => {
        arr.push(item[key]);
    });
    return arr.join("、");
};

/**
 * 计算是kb还是Mb
 * @param number
 */
export const getFileSizeNumber = (number) => {
    return number > 1024 ? (number > 1024 * 1024 ? parseInt(number / 1024 / 1024) + "MB" : parseInt(number / 1024) + "KB") : number + "B";
};

/**
 * 处理接口来的配置信息（前后端字段不一致，需要转下）
 * @param form
 */
export const dealFormAnalysis = (form) => {
    let newForm = [];
    form.map((item, index) => {
        newForm[index] = {
            message: item.errorMsg,
            name: item.fieldLabel,
            link: item.fieldMock,
            options: item.fieldOptions ? item.fieldOptions : [],
            fieldName: item.fieldProp,
            type: item.fieldType,
            rule: item.filedRules,
            listShow: item.isListShow === 1 ? true : false,
            placeholder: item.placeholder,
            searchRule: item.searchRules,
            defaultValue: item.defaultValue ? item.defaultValue : null,
        };
        if (item.fieldType === "select" || item.fieldType === "picture" || item.fieldType === "file") {
            if (item.filedRules && item.filedRules.max > 1) {
                newForm[index].multiple = true;
            } else {
                newForm[index].multiple = false;
            }
            newForm[index].defaultValue = item.defaultValue && typeof item.defaultValue === "string" ? item.defaultValue.split(",") : [];
        }

        if (item.fieldType === "checkbox" || item.fieldType === "area") {
            newForm[index].defaultValue = item.defaultValue && typeof item.defaultValue === "string" ? item.defaultValue.split(",") : [];
        }
        if (item.fieldType === "table") {
            newForm[index].defaultValue = [];
            if (item.children && item.children.length) {
                newForm[index].children = dealFormAnalysis(item.children);
            } else {
                newForm[index].children = [];
            }
        }
    });
    return newForm;
};

/**
 * 处理给接口的数据
 * @param form
 */
export const dealForm = (form) => {
    let newForm = [];
    form.map((item, index) => {
        newForm[index] = {
            sort: index,
            errorMsg: item.message,
            fieldLabel: item.name,
            fieldMock: item.link,
            fieldOptions: item.options ? item.options : [],
            fieldProp: item.fieldName,
            fieldType: item.type,
            filedRules: item.rule,
            isListShow: item.listShow ? 1 : 0,
            placeholder: item.placeholder,
            searchRules: item.searchRule,
        };
        if (
            item.type === "table" ||
            (item.multiple && item.type === "select") ||
            item.type === "file" ||
            item.type === "checkbox" ||
            item.type === "picture"
        ) {
            if (item.defaultValue && typeof item.defaultValue === "object") {
                newForm[index].defaultValue = item.defaultValue.join(",");
            }
        } else {
            newForm[index].defaultValue =
                item.defaultValue && (typeof item.defaultValue === "string" || typeof item.defaultValue === "number")
                    ? item.defaultValue
                    : "";
        }
        if (item.children && item.children.length) {
            newForm[index].children = dealForm(item.children);
        }
    });
    return newForm;
};

/**
 * 判断手机号
 */
export const isPhone = (val, type = "phone") => {
    //判断手机号码
    let reg1 = /^1\d{10}$/;
    let reg2 = /^0\d{2,3}-?\d{7,8}$/;
    if (type === "phone") {
        return reg1.test(val) ? true : false;
    } else {
        return reg1.test(val) || reg2.test(val) ? true : false;
    }
};

/**
 * 邮箱
 * 以数字字母开头，中间可以是多个数字字母下划线或‘-’，或‘.’
 * “@”符号，后面是数字字母
 * .”符号，后面是2-6个字母结尾
 */
export const isEmail = (val) => {
    let reg = /^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/;
    return reg.test(val) ? true : false;
};

/**
 * 是否包含中文
 */
export const hasCN = (val) => {
    let reg = /.*[\u4e00-\u9fa5]+.*$/;
    return reg.test(val) ? true : false;
};

/**
 * 判断身份证
 */
export const isIdCard = (code) => {
    //判断身份证
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 ",
    };
    var row = true;
    //var msg = "验证成功";
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
        row = false;
        //msg = "身份证号格式错误";
    } else if (!city[code.substr(0, 2)]) {
        row = false;
        //msg = "身份证号地址编码错误";
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split("");
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != code[17].toUpperCase()) {
                row = false;
                //msg = "身份证号校验位错误";
            }
        }
    }
    return row;
};

/**
 * 时间格式化
 * **/
export const getFormatDate = (type = "date", someday) => {
    let date = someday ? someday : new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let H = date.getHours();
    let i = date.getMinutes();
    let s = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (i >= 0 && i <= 9) {
        i = "0" + i;
    }
    if (s >= 0 && s <= 9) {
        s = "0" + s;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    if (type === "datetime") currentdate += " " + H + ":" + i + ":" + s;
    if (type === "datetimeI") currentdate += " " + H + ":" + i;
    if (type === "time") currentdate = H + ":" + i + ":" + s;
    if (type === "dateM") currentdate = year + seperator1 + month;
    if (type === "timeI") currentdate = H + ":" + i;
    if (type === "year") currentdate = year;
    return currentdate;
};

/**
 * 是否是空对象、空数据、null或空（‘’）；0和false不计入
 * @param {*} val
 * @returns
 */
export const isEmpty = (val) => {
    if (
        (typeof val === "object" && JSON.stringify(val) === "{}") ||
        (Object.prototype.toString.call(val) === "[object Array]" && JSON.stringify(val) === "[]") ||
        val === null ||
        val === ""
    ) {
        return true;
    } else {
        return false;
    }
};

/**
 * 将表单配置数据解析成表单组件渲染需要的【数组】
 * @param  form 数组，指定格式数据的表单
 */
export const analysisFormConfArray = (form) => {
    form.map((item, index) => {
        form[index] = analysisFormConf(item);
        if (form[index].children && form[index].children.length) {
            form[index].children.map((i, ind) => {
                form[index].children[ind] = analysisFormConf(i);
            });
        }
    });
    return form;
};

/**
 * 将表单数据中每行数据解析成配置表单需要的【单行处理】
 * @param {*} formItem 对象
 */
export const analysisFormConf = (formItem) => {
    let newItem = {
        type: formItem.fieldType,
        message: formItem.errorMsg || "请正确填写" + formItem.fieldLabel,
        name: formItem.fieldLabel || "",
        options: formItem.fieldOptions || [],
        defaultValue: formItem.defaultValue,
        fieldName: formItem.fieldProp,
        placeholder: formItem.placeholder,
        children: formItem.children || [],
        rule: {
            max: formItem.filedRules && (formItem.filedRules.max || formItem.filedRules.max === 0) ? formItem.filedRules.max : null,
            min: formItem.filedRules && (formItem.filedRules.min || formItem.filedRules.min === 0) ? formItem.filedRules.min : null,
            require: formItem.filedRules && formItem.filedRules.require ? true : false,
        },
    };
    if (!newItem.fieldName) {
        newItem.fieldName = createRandomKey();
    }
    if (!newItem.placeholder) {
        newItem.placeholder = getDefaultPlaceholder(newItem.type, newItem.name);
    }
    if (newItem.type === "table") {
        newItem.table = [];
    }
    return newItem;
};

/**
 * 组装输入框提示语
 * @param {*} item 对象
 */
export const getDefaultPlaceholder = (type, name) => {
    let tip = "";
    switch (type) {
        case "input":
        case "textarea":
        case "inputNumber":
            tip = "请输入" + name;
            break;
        case "select":
        case "checkbox":
        case "area":
        case "date":
        case "datetime":
        case "year":
        case "radio":
            tip = "请选择" + name;
            break;
        case "picture":
        case "file":
            tip = "请上传" + name;
            break;
        default:
            break;
    }
    return tip;
};

/**
 * 表单默认值（这个方法只考虑了两层）
 * @param {*} form 表单内容
 * @param {*} data 表单数据
 */
export const getFormFieldValue = (form, data = {}, isEdit = false) => {
    let formValue = {};
    form.map((item) => {
        if (item.type === "checkbox" || (item.type === "select" && (item.rule.max > 0 || item.rule.min > 0)) || item.type === "area") {
            formValue[item.fieldName] = data[item.fieldName]
                ? data[item.fieldName]
                : isEdit
                ? []
                : item.defaultValue && typeof item.defaultValue === "string"
                ? item.defaultValue.split(",")
                : [];
        } else if (item.type === "picture" || item.type === "file") {
            formValue[item.fieldName] = [];
            //图片，文件，字段需要处理
            if (data[item.fieldName + "Text"] && data[item.fieldName + "Text"].length) {
                data[item.fieldName + "Text"].map((fil) => {
                    formValue[item.fieldName].push({
                        id: fil.id,
                        path: fil.url,
                        name: fil.name,
                    });
                });
            } else {
                formValue[item.fieldName] = item.defaultValue ? item.defaultValue : [];
            }
        } else if (item.type === "inputNumber") {
            formValue[item.fieldName] =
                data[item.fieldName] || data[item.fieldName] === "0" || data[item.fieldName] === 0
                    ? Number(data[item.fieldName])
                    : isEdit
                    ? null
                    : item.defaultValue
                    ? Number(item.defaultValue)
                    : null;
        } else if (item.type === "table") {
            //先处理下自己在处理子级
            formValue[item.fieldName] = data[item.fieldName]
                ? data[item.fieldName]
                : isEdit
                ? []
                : item.defaultValue
                ? item.defaultValue
                : [];
            if (data[item.fieldName] && data[item.fieldName].length) {
                let children = JSON.parse(JSON.stringify(item.children));
                children.action = false;
                data[item.fieldName].map((ta, ind) => {
                    let formAndData = getFormFieldValue(item.children, ta, isEdit);
                    formValue[item.fieldName][ind] = formAndData.data;
                    item.table.push(children);
                });
            }
        } else {
            formValue[item.fieldName] = data[item.fieldName]
                ? data[item.fieldName] + ""
                : isEdit
                ? ""
                : item.defaultValue
                ? item.defaultValue + ""
                : "";
        }
    });
    return { data: formValue, form: form };
};

/**
 * 拼接表单数据和表格列名
 * 返回适用于search和columns的数据结构
 */
export const formToTableCloumns = (form) => {
    form = form.filter((item) => item.isListShow === 1);
    let searchColumns = form.filter((item) => item.searchRules > 0);
    let timeType = ["year", "date", "datetime"]; //特殊处理的时间数组
    let allowColumns = ["input", "textarea", "inputNumber", "radio", "checkboxes", "select", "picture", "area", "date", "year", "datetime"];
    let allowSearch = ["input", "inputNumber", "radio", "checkbox", "select", "date", "year", "datetime"];
    let columns = []; //列显组装
    let search = []; //搜索组装
    searchColumns.map((item) => {
        if (allowSearch.includes(item.fieldType)) {
            if (timeType.includes(item.fieldType)) {
                search.push({
                    type: "duration",
                    title: item.fieldLabel,
                    key: item.fieldProp + "Start",
                    endTimekey: item.fieldProp + "End",
                    aboutStart: item.fieldProp + "Start",
                    aboutEnd: item.fieldProp + "End",
                });
            } else {
                search.push({
                    type: item.fieldType,
                    title: item.fieldLabel,
                    key: item.fieldProp,
                    value: "",
                    options: item.fieldOptions,
                });
            }
        }
    });
    form.map((item) => {
        if (allowColumns.includes(item.fieldType)) {
            let tempColumn = {
                title: item.fieldLabel,
                key: item.fieldProp,
                align: "center",
                width: 150,
                defaultShow: false,
            };
            switch (item.fieldType) {
                case "picture":
                    if (!item.filedRules || (item.filedRules && (item.filedRules.max === 1 || !item.filedRules.max))) {
                        tempColumn.render = (h, params) => {
                            return h("viewer", {}, [
                                h("img", {
                                    attrs: {
                                        src:
                                            params.row[item.fieldProp + "Text"] && params.row[item.fieldProp + "Text"][0]
                                                ? params.row[item.fieldProp + "Text"][0].url
                                                : "",
                                    },
                                    style: {
                                        height: "25px",
                                        maxWidth: "100px",
                                        objectFit: "cover",
                                    },
                                }),
                            ]);
                        };
                    }
                    break;
                case "radio":
                case "checkbox":
                case "select":
                case "area":
                    tempColumn.render = (h, params) => {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    placement: "bottom",
                                    transfer: true,
                                    maxWidth: "300",
                                    disabled: !params.row[item.fieldProp + "Text"],
                                },
                            },
                            [
                                h(
                                    "div",
                                    {
                                        slot: "content",
                                    },
                                    [h("div", params.row[item.fieldProp + "Text"])]
                                ),
                                h(
                                    "span",
                                    {
                                        style: {
                                            display: "-webkit-box",
                                            textOverflow: "ellipsis",
                                            "-webkit-box-orient": "vertical",
                                            "-webkit-line-clamp": item.tooltipLine || 1, //数字代表行数，自行设置
                                            overflow: "hidden",
                                        },
                                    },
                                    params.row[item.fieldProp + "Text"] || "--"
                                ),
                            ]
                        );
                    };
                    break;
                default:
                    break;
            }
            columns.push(tempColumn);
        }
    });
    return { columns, search };
};

/**
 * 金额格式化
 * @param {Number} value 值
 * @param {Number} precision 小数位
 * @param {String} defaultValue 为0时的默认值
 * @return {String}
 */
export const formatMoney = (value, precision = 2, defaultValue = "0.00") => {
    value = precision > 0 ? Number(value).toFixed(2) : Number(value);
    return value > 0 ? (value + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,") : defaultValue;
};

/**
 * 金额*100
 * @param {Number} value 值
 * @return {Number}
 */
export const moneyCent = (value) => {
    return Number((value * 100).toFixed(2));
};

/**
 * 金额/100
 * @param {Number} value 值
 * @return {Number}
 */
export const centMoney = (value) => {
    return value ? Number((Number(value) / 100).toFixed(2)) : 0.0;
};

/**
 * 获取本地配置文件内容
 * @param {String} key 键值
 * @return {String,Object,Array}
 */
export const getBaseConfig = (key) => {
    let keyArr = key.split(".");
    let value = null;
    switch (keyArr.length) {
        case 1:
            //eslint-disable-next-line
      value = config[keyArr[0]]
            break;
        case 2:
            //eslint-disable-next-line
      value = config[keyArr[0]][keyArr[1]]
            break;
        case 3:
            //eslint-disable-next-line
      value = config[keyArr[0]][keyArr[1]][keyArr[2]]
            break;
        default:
            break;
    }
    return value ? value : "";
};

/**
 * 下划线后面字母小写变大写并删除下划线
 * @param {String} string 值
 * @return {String}
 */
export const lineToUp = (string) => {
    //eslint-disable-next-line
  return string.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
};

/**
 * 前端时间判断
 * @param {String} string 值
 * @return {String}
 */
export const getStatus = (starttime, endtime) => {
    let status = null;
    let start = new Date(starttime).getTime();
    let now = new Date().getTime();
    if (start > now) {
        status = 1; // 未开始
    } else if (endtime) {
        let end = new Date(endtime).getTime();
        if (end >= now) {
            status = 2; // 进行中
        } else {
            status = 3; // 已结束
        }
    } else if (!endtime) {
        status = 2; // 进行中
    }
    return status;
};
