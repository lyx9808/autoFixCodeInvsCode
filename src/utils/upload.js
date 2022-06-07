/**
 * @file 文件上传处理，含分片上传
 * @author wo23sui
 */
import api from "@/api";
import SparkMd5 from "spark-md5";
import { getBaseConfig } from "@/utils/tools.js";

/**
 * 分片上传文件
 * @param {File} file
 * @param {Object} params 额外参数
 * @param {String} action 接口地址key
 * @param {Function} successCallback 成功回调
 * @param {Function} chunkCallback 进度回调
 * @param {Function} errorCallback 失败回调
 * @returns
 */
export const uploadFile = (file, params, action, successCallback, chunkCallback, errorCallback) => {
    let partSize = getBaseConfig("UPLOAD.PART.SIZE");
    if (file.size > partSize) {
        // 获取分片ID
        params.fileName = file.name;
        params.fileSize = file.size;
        params.fileExt = file.name.substring(file.name.lastIndexOf("."));
        let fileChunkList = createFileChunk(file, partSize);
        // 获取文件的Md5
        calculateMd5(fileChunkList).then((fileMd5) => {
            params.fileMd5 = fileMd5;
            let partId = "";
            api[action]
                .part(params)
                .then((res) => {
                    if (res.data.partId) {
                        partId = res.data.partId;
                        // 分片上传
                        let forms = fileChunkList.map(({ file }, index) => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("partNum", index + 1);
                            return formData;
                        });

                        sendChunkRequest(forms, partId, chunkCallback, errorCallback)
                            .then(() => {
                                //分片合并
                                completePartRequest(partId, successCallback, errorCallback);
                            })
                            .catch(() => {});
                        // eslint-disable-next-line
        } else if (res.data.fileId) {
                        successCallback(res.data);
                    } else {
                        errorCallback();
                    }
                })
                .catch(() => {
                    // 失败回调
                    errorCallback();
                });
        });
    } else {
        // 一次性上传
        let formData = new FormData();
        formData.append("file", file);
        if (params) {
            for (let key in params) {
                formData.append(key, params[key]);
            }
        }
        api[action]
            .upload(formData)
            .then((res) => {
                successCallback(res.data);
            })
            .catch(() => {
                errorCallback();
            });
    }
};

/**
 * 创建文件切片
 * @param {File} file
 * @param {Number} size 单片文件大小
 * @returns {Array}
 */
export const createFileChunk = (file, size) => {
    const fileChunkList = [];
    var start = 0;
    while (start < file.size) {
        fileChunkList.push({
            file: file.slice(start, start + size),
        });
        start += size;
    }
    return fileChunkList;
};

/**
 * 分片文件-文件Md5
 * @param {Array} fileChunkList  分片
 * @returns {String}
 */
export const calculateMd5 = (fileChunkList) => {
    return new Promise((resolve) => {
        const spark = new SparkMd5.ArrayBuffer();
        let count = 0;
        const loadNext = (index) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(fileChunkList[index].file);
            reader.onload = (e) => {
                count++;
                spark.append(e.target.result);
                if (count === fileChunkList.length) {
                    resolve(spark.end());
                } else {
                    // 可根据情况加入md5的进度
                    //percentage += 100 / fileChunkList.length
                    loadNext(count);
                }
            };
        };
        loadNext(0);
    });
};

/**
 * 分片文件上传
 * @param {Array} forms  分片
 * @returns {String}
 */
export const sendChunkRequest = (forms, partId, chunkCallback, errorCallback) => {
    var finished = 0;
    var percentage = 0;
    const total = forms.length;
    // eslint-disable-next-line
  return new Promise((resolve, reject) => {
        const handler = () => {
            if (forms.length) {
                // 从分片中拿出一个进行上传
                const formInfo = forms.shift();
                // eslint-disable-next-line
        api.upload.uploadPart(formInfo, partId).then(res => {
                        finished++;
                        percentage += Number((100 / total).toFixed(2));
                        chunkCallback(Number(percentage.toFixed(2)));
                        handler();
                    })
                    .catch(() => {
                        errorCallback();
                    });
            }
            if (finished >= total) {
                resolve("done");
            }
        };
        if (finished !== 0) {
            // 控制并发
            for (let i = 0; i < 3; i++) {
                handler();
            }
        } else {
            handler();
        }
    }).catch(() => {
        errorCallback();
    });
};

/**
 * 分片文件合并
 * @param {String} partId  分片ID
 * @returns {Object}
 */
export const completePartRequest = (partId, successCallback, errorCallback) => {
    // eslint-disable-next-line
  api.upload.completeUploadPart({ partId: partId }).then(res => {
            successCallback(res.data);
        })
        .catch(() => {
            errorCallback();
        });
};
