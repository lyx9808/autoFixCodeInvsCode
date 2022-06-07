/* 
    设置存储
    key 存储的关键字，
    value 存储的值，
    type默认是localStorage，有type值即为sessionStorage,
    json 是否是JSON.stringify的存储方式
*/
export const setStorage = ({ key, value, type = false, json = false }) => {
    // eslint-disable-next-line
  key = config.APP_NAME + '_' + process.env.VUE_APP_PREFIX + "_" + key;
    value = json && value ? JSON.stringify(value) : value;
    if (type == "sessionStorage") {
        sessionStorage.setItem(key, value);
    } else {
        localStorage.setItem(key, value);
    }
};
/* 
  获取存储
  key 存储的关键字，
  type默认是localStorage，有type值即为sessionStorage
  json 是否是JSON.parse的获取方式
*/
export const getStorage = ({ key, type = false, json = false }) => {
    // eslint-disable-next-line
  key = config.APP_NAME + '_' + process.env.VUE_APP_PREFIX + "_" + key;
    let result;
    if (type == "sessionStorage") {
        result = sessionStorage.getItem(key);
    } else {
        result = localStorage.getItem(key);
    }
    return result && json ? JSON.parse(result) : result;
};

/* 
  清除存储
  key 存储的关键字，type默认是localStorage，有type值即为sessionStorage
*/
export const removeStorage = ({ key, type = false }) => {
    // eslint-disable-next-line
  key = config.APP_NAME + '_' + process.env.VUE_APP_PREFIX + "_" + key;
    if (type == "sessionStorage") {
        sessionStorage.removeItem(key);
    } else {
        localStorage.removeItem(key);
    }
};
