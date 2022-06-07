/* eslint-disable prefer-rest-params */
/* eslint-disable no-multi-assign */
import { getType, isObject, isArray, isBasicType, isDefined } from "./type";

/**
 * 深拷贝，此处不考虑Symbol,Map,Set,Function等数据类型
 * @param {any} obj 待深拷贝的数据
 */
export function deepClone(obj) {
    let newObj;
    if (isObject(obj)) {
        newObj = {};
        Object.keys(obj).forEach((key) => {
            newObj[key] = deepClone(obj[key]);
        });
    } else if (isArray(obj)) {
        newObj = [];
        obj.forEach((item) => {
            newObj.push(deepClone(item));
        });
    } else {
        newObj = obj;
    }
    return newObj;
}

/**
 * 判断非空，暂时只用来判断String,Array,Object类型
 * @param {any} val 待判断的变量
 */
export function isEmpty(val) {
    const dataType = getType(val);
    if (dataType === "object") {
        return Object.keys(val).length === 0;
    } else if (dataType === "array" || dataType === "string") {
        return val.length === 0;
    }
}

/**
 * 按照keys从对象中筛选参数
 * @param {Object} obj 对象
 * @param {string | Array} keys 键名
 */
export function pick(obj, keys) {
    const type = getType(keys);
    const pickedObj = {};
    if (type === "string") {
        pickedObj[keys] = deepClone(obj[keys]);
    } else if (type === "array") {
        keys.forEach((key) => {
            pickedObj[key] = deepClone(obj[key]);
        });
    }
    return pickedObj;
}

/**
 * 按照keys从对象中排除参数
 * @param {Object} obj 对象
 * @param {string | Array} keys 键名
 */
export function omit(obj, keys) {
    const type = getType(keys);
    const omittedObj = {};
    const srcObjKeys = Object.keys(obj);
    if (type === "string") {
        srcObjKeys.forEach((srcKey) => {
            if (srcKey !== keys) {
                omittedObj[srcKey] = deepClone(obj[srcKey]);
            }
        });
    } else if (type === "array") {
        srcObjKeys.forEach((srcKey) => {
            if (!keys.includes(srcKey)) {
                omittedObj[srcKey] = deepClone(obj[srcKey]);
            }
        });
    }
    return omittedObj;
}

/**
 * 获取数组中最后一个元素
 * @param {Array} arr 数组
 */
export function last(arr) {
    return arr[arr.length - 1];
}

/**
 * 根据求值条件判断数组中最小的项
 * @param {Array} arr 数组
 * @param {Function|String} iteratee 返回一个求值表达式，可以根据数组元素某属性找出最小的项，比如return item.age
 */
export function minBy(arr, iteratee) {
    let values = [];
    if (typeof iteratee === "function") {
        values = arr.map((item, index) => {
            return iteratee(item, index, arr);
        });
    } else if (typeof iteratee === "string") {
        values = arr.map((item) => item[iteratee]);
    }
    const minOne = Math.min(...values);
    const minIndex = values.findIndex((item) => item === minOne);
    return minIndex === -1 ? undefined : arr[minIndex];
}

/**
 * 根据求值条件判断数组中最大的项
 * @param {Array} arr 数组
 * @param {Function|String} iteratee 返回一个求值表达式，可以根据数组元素某属性找出最大的项，比如return item.age
 */
export function maxBy(arr, iteratee) {
    let values = [];
    if (typeof iteratee === "function") {
        values = arr.map((item, index) => {
            return iteratee(item, index, arr);
        });
    } else if (typeof iteratee === "string") {
        values = arr.map((item) => item[iteratee]);
    }
    const minOne = Math.max(...values);
    const minIndex = values.findIndex((item) => item === minOne);
    return minIndex === -1 ? undefined : arr[minIndex];
}

// 比较值是否一样，如果是引用类型，会通过递归方式去比较值
export function isEqual(obj1, obj2) {
    const [type1, type2] = [getType(obj1), getType(obj2)];
    if (type1 === type2) {
        if (isBasicType(obj1)) {
            return obj1 === obj2;
        } else if (type1 === "object") {
            return Object.keys(obj1).every((key) => {
                return isEqual(obj1[key], obj2[key]);
            });
        } else if (type1 === "array") {
            return obj1.every((item, index) => {
                return isEqual(item, obj2[index]);
            });
        } else if (type1 === "function" || type1 === "symbol") {
            return obj1.toString() === obj2.toString();
        } else if (type1 === "map") {
            const handledKeys1 = Array.from(obj1.keys());
            const handledKeys2 = Array.from(obj2.keys());
            return handledKeys1.length === handledKeys2.length && handledKeys1.every((key) => isEqual(obj1.get(key), obj2.get(key)));
        } else if (type1 === "set") {
            const handledArray1 = Array.from(obj1.values());
            const handledArray2 = Array.from(obj2.values());
            return (
                handledArray1.length === handledArray2.length && handledArray1.every((item, index) => isEqual(item, handledArray2[index]))
            );
        } else {
            // 未知类型
            return false;
        }
    } else {
        // 类型不一致，无需比较
        return false;
    }
}

function contains(obj, item) {
    const dataType = getType(obj);
    let containFlag = false;
    if (dataType === "object") {
        const keys = Object.keys(obj);
        for (let index = 0; index < keys.length; index++) {
            if (isEqual(keys[index], item)) {
                containFlag = true;
                break;
            }
        }
    } else if (dataType === "array") {
        for (let index = 0; index < obj.length; index++) {
            if (isEqual(obj[index], item)) {
                containFlag = true;
                break;
            }
        }
    } else {
        throw new Error("only support type of object or array!");
    }
    return containFlag;
}

function findIndex(arr, item) {
    let targetIndex = -1;
    for (let index = 0; index < arr.length; index++) {
        if (isEqual(arr[index], item)) {
            targetIndex = index;
            break;
        }
    }
    return targetIndex;
}

// 合并两个数据，用于支撑merge方法
function mergeTwo(obj1, obj2) {
    const dataType1 = getType(obj1);
    const dataType2 = getType(obj2);
    if (dataType1 === dataType2) {
        // 如果合并的两个数据类型一致，才进行处理，否则直接返回obj1
        if (dataType1 === "object") {
            // Object类型
            Object.keys(obj2).forEach((key) => {
                // 遍历obj2的keys
                if (obj1.hasOwnProperty(key)) {
                    // 如果obj1包含obj2的key，采用合并策略
                    obj1[key] = mergeTwo(obj1[key], obj2[key]);
                } else {
                    // 不包含，则直接赋值
                    obj1[key] = deepClone(obj2[key]);
                }
            });
        } else if (dataType1 === "array") {
            // Array类型
            obj2.forEach((item) => {
                // 遍历obj2
                if (contains(obj1, item)) {
                    // 合并数组不能forEach按顺序遍历，只能判断是否包含，如果obj1包含item，采用合并策略
                    const dataindex = findIndex(obj1, item);
                    obj1[dataindex] = mergeTwo(obj1[dataindex], item);
                } else {
                    // 不包含，直接push
                    obj1.push(deepClone(item));
                }
            });
        } else if (isBasicType(obj1)) {
            obj1 = obj2;
        }
    }
    return obj1;
}

// 合并多个对象
export function merge(srcObj, ...objs) {
    const srcObjType = getType(srcObj);
    if (srcObjType === "object" || srcObjType === "array") {
        const isSameType = objs.every((item) => {
            return getType(item) === srcObjType;
        });
        if (isSameType) {
            // 是同样的类型，进行合并操作
            if (srcObjType === "object") {
                // object
                return [srcObj, ...objs].reduce((preVal, curVal) => {
                    return mergeTwo(preVal, curVal);
                }, {});
            } else {
                // array
                return [srcObj, ...objs].reduce((preVal, curVal) => {
                    return mergeTwo(preVal, curVal);
                }, []);
            }
        } else {
            // 类型不一致，直接深拷贝源对象
            return deepClone(srcObj);
        }
    } else {
        // 其他数据类型
        throw new Error("only support type of object or array!");
    }
}

export function uniq(arr) {
    const uniqValues = [];
    const results = [];
    arr.forEach((item) => {
        if (uniqValues.indexOf(item) === -1) {
            uniqValues.push(item);
            results.push(item);
        }
    });
    return results;
}

export function uniqBy(arr, key, priority) {
    const uniqValues = [];
    const results = [];
    const isPriorityFunction = typeof priority === "function";
    arr.forEach((item) => {
        if (!item.hasOwnProperty(key)) {
            results.push(deepClone(item));
        } else {
            const existIndex = uniqValues.indexOf(item[key]);
            if (existIndex === -1) {
                // key不存在的，直接插入
                uniqValues.push(item[key]);
                results.push(deepClone(item));
            } else {
                // key已经存在
                if (isPriorityFunction) {
                    // 如果需要判断优先级
                    const existPriority = priority(arr[existIndex]);
                    const currentPriority = priority(item);
                    if (currentPriority > existPriority) {
                        results.splice(existIndex, 1, deepClone(item));
                    }
                }
            }
        }
    });
    return results;
}

export function partition(arr, iterator) {
    const results = [[], []];
    arr.forEach((item) => {
        if (iterator(item)) {
            results[0].push(deepClone(item));
        } else {
            results[1].push(deepClone(item));
        }
    });
    return results;
}

export function debounce(func, wait, options) {
    let lastArgs;
    let lastThis;
    let maxWait;
    let result;
    let timerId;
    let lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof func !== "function") {
        throw new TypeError("first param must be function.");
    }
    wait = Number(wait) || 0;
    if (isObject(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (
            lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= maxWait)
        );
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel() {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function debounced() {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                // Handle invocations in a tight loop.
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}

export function throttle(func, wait, options) {
    let leading = true;
    let trailing = true;

    if (typeof func !== "function") {
        throw new TypeError("the first param is not a function");
    }
    if (isObject(options)) {
        leading = "leading" in options ? !!options.leading : leading;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
        leading,
        maxWait: wait,
        trailing,
    });
}

/**
 * 下载文件
 * @param {string} url 文件url
 * @param {string} filename 文件名
 */
export function downloadFile(url, filename) {
    let link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
}

/**
 * 打开新窗口
 * @param {string} url 新窗口url
 */
export function openWin(url) {
    let link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
}

/**
 * 参数对象转为querystring
 * @param {Object} obj 参数对象
 * @param {boolean} enableEncode 是否使用encodeURIComponent编码
 * @returns {string} 转换后的querystring
 */
export function stringify(obj, enableEncode = false) {
    if (!obj) {
        return "";
    }
    let result = "";
    Object.keys(obj).forEach((key) => {
        let val;
        if (obj[key] instanceof Array) {
            val = obj[key].join(",");
        } else {
            val = enableEncode ? encodeURIComponent(obj[key]) : obj[key];
        }
        result += `${key}=${val}&`;
    });
    return result;
}

/**
 * 根据基地址和参数对象，拼接为带querystring的url
 * @param {string} baseurl 基地址
 * @param {Object} obj 参数对象
 * @returns {string} 带querystring的url
 */
export function generateQuerystringURL(baseurl, params) {
    const handledObj = paramsFilter(params);
    return `${baseurl}?${stringify(handledObj, true)}`;
}

/**
 * 处理参数对象
 * @param {Object} obj 参数对象
 * @param {Array} whiteKeys 不做处理的白名单Key，
 * @param {boolean} isHttpGet 是否是http get请求，如果是，则将数组处理成逗号分隔
 * @returns {Object} 处理后的参数对象
 */
export function paramsFilter(obj, whiteKeys = [], isHttpGet = false) {
    if (getType(obj) !== "object") {
        return {};
    }
    const newObj = deepClone(obj);
    Object.keys(newObj).forEach((key) => {
        if (!whiteKeys.includes(key)) {
            const element = newObj[key];
            const type = getType(element);
            if (element === "" || type === "null" || type === "undefined" || (type === "array" && element.length === 0)) {
                delete newObj[key];
            } else if (isHttpGet && type === "array") {
                newObj[key] = element.join(",");
            }
        }
    });
    return newObj;
}

/**
 * 处理参数对象，主要是处理application/json类型
 * @param {Object} params 参数对象
 */
export function paramsFilterJson(params) {
    const cloneObj = deepClone(params);
    function deepRejectInvalidParam(obj) {
        Object.keys(obj).forEach((key) => {
            if (!isDefined(obj[key])) {
                delete obj[key];
            } else if (isObject(obj[key])) {
                deepRejectInvalidParam(obj[key]);
            } else if (isArray(obj[key])) {
                obj[key].forEach((item, index, arr) => {
                    if (isObject(item)) {
                        deepRejectInvalidParam(arr[index]);
                    }
                });
            }
        });
    }
    deepRejectInvalidParam(cloneObj);
    return cloneObj;
}

export function flattenObject(obj) {
    const cloneObj = deepClone(obj);
    Object.keys(cloneObj).forEach((key) => {
        const element = cloneObj[key];
        if (isObject(element)) {
            Object.keys(element).forEach((subKey) => {
                const value = element[subKey];
                cloneObj[`${key}.${subKey}`] = value;
            });
            delete cloneObj[key];
        }
    });
    return cloneObj;
}

/**
 * 检查文件类型，是否是合法的，这里的validMIMEList仅写了部分，如果需要支持更多，请查询MIME参考手册，增加更多的MIME类型进来
 * @param {Object} file 文件对象
 * @param {String} exts 文件合法类型，格式：doc|docx|png
 * @returns {boolean} 文件是否合法
 */
export function checkFileType(file, exts) {
    const validMIMEList = [
        // doc
        "application/msword",
        // xls
        "application/vnd.ms-excel",
        // docx
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // xlsx
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // pdf
        "application/pdf",
        // rar
        "application/x-rar-compressed",
        // zip
        "application/zip",
    ];
    const validExts = exts.split("|");
    const fileExt = getFileExt(file.name);
    if (validMIMEList.includes(file.type) || validExts.includes(fileExt)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取文件后缀名
 * @param {string} fileName 文件全名，包含后缀名的那种
 * @returns {string} 文件后缀名
 */
export function getFileExt(fileName) {
    const splits = fileName.split(".");
    return last(splits);
}

/**
 * 按顺序执行promise task
 * @param {Array} promiseTaskList promise任务列表
 */
export function sequencePromise(promiseTaskList) {
    let promiseChain = null;
    const resps = [];
    promiseTaskList.forEach((item, index) => {
        if (index === 0) {
            promiseChain = item();
        } else {
            promiseChain = promiseChain.then((res) => {
                resps.push(res);
                return item();
            });
        }
    });
    return promiseChain.then((res) => {
        return resps.concat(res);
    });
}

/**
 * 数字前面补0
 * @param {string | number} value 原始数据
 * @param {number} digits 最终的结果总共是几位
 */
export function prefixZero(value, digits) {
    if (typeof value === "number") {
        if (value < 0) {
            value = 0;
        }
        value = String(value);
    }
    if (value.length < digits) {
        const diff = digits - value.length;
        for (let index = 0; index < diff; index++) {
            value = `0${value}`;
        }
    }
    return value;
}

// 去掉协议判断资源是否相同
function isSameUrl(url1, url2) {
    const handledUrl1 = /^(https?:)?\/\//.test(url1) ? url1.replace(/^(https?:)?\/\//, "") : url1;
    const handledUrl2 = /^(https?:)?\/\//.test(url2) ? url2.replace(/^(https?:)?\/\//, "") : url2;
    return handledUrl1 === handledUrl2;
}

export function loadScript(src, parentNode = document.body, isCheckRepeat = true, replace = false) {
    return new Promise((resolve, reject) => {
        if (src[0] === ".") {
            throw new Error("the src parameter must be an absolute url");
        }
        if (isCheckRepeat) {
            const toCheckUrl = src[0] === "/" && src[1] !== "/" ? `${window.location.protocol}//${window.location.host}${src}` : src;
            const targetScript = [...document.scripts].find((item) => isSameUrl(item.src, toCheckUrl));
            if (targetScript) {
                if (replace) {
                    targetScript.parentNode.removeChild(targetScript);
                } else {
                    // script标签已经加载过
                    return resolve("existed");
                }
            }
        }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        parentNode.appendChild(script);
        const supportLoad = "onload" in script;
        if (supportLoad) {
            script.onload = function () {
                // script标签加载成功
                resolve("loaded");
            };
        } else {
            // 低版本ie不支持onload，其实一般也用不到
            script.onreadystatechange = function () {
                if (this.readyState === "loaded" || this.readyState === "complete") {
                    resolve("loaded");
                }
            };
        }
        script.onerror = (event) => {
            reject(event);
        };
    });
}
