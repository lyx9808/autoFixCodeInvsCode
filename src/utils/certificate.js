/**
 * 捐赠证书生成
 * @param {Object} params 证书相关参数
 * @returns {base64}
 */
export const getCertificate = (id = "canvas", params, callback) => {
    var certificateText =
        handleStr(params.certificate || "", {
            userName: params.userName || "",
            projectName: params.projectName || "",
            amount: params.amount || "",
            payTime: params.payTime || "",
        }) || [];

    //证书落款获取
    var orgName = params.orgName || "";
    //使用canvas画图
    var canvas = document.getElementById(id);
    var bgImg = new Image();
    bgImg.src = params.bgImgUrl + "?time=" + new Date().getTime();
    bgImg.setAttribute("crossOrigin", "Anonymous");
    bgImg.onload = function () {
        //图片加载完，再draw 和 toDataURL
        var bgWidth = bgImg.width; //获取图片真实宽度
        var bgHeight = bgImg.height; //获取图片真实高度
        canvas.width = bgWidth;
        canvas.height = bgHeight;
        var screeWidth = bgWidth;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(bgImg, 0, 0, screeWidth, screeWidth * 1.493); //画背景图
        /**证书编号开始 */
        ctx.font = screeWidth * 0.028 + "px Microsoft YaHei";
        ctx.fillStyle = "#b6924b";
        var orderNo = "证书编号：" + params.orderNo;
        var orderNoLength = getTrueLength(orderNo);
        ctx.fillText(orderNo, (screeWidth - orderNoLength * screeWidth * 0.015) / 2, screeWidth * 0.341);
        /**证书编号结束 */

        /**画姓名和下划线开始 */
        ctx.font = screeWidth * 0.04 + "px Microsoft YaHei";
        var name = params.userName;
        var nameLength = getTrueLength(name);
        ctx.fillStyle = "#b6924b";
        if (ctx.measureText(name).width > screeWidth * 0.757) {
            var nameLastEndWidth = 0;
            for (var i = name.length; i >= 0; i--) {
                if (ctx.measureText(name.substr(0, i)).width + nameLastEndWidth < screeWidth * 0.757) {
                    ctx.fillText(name.substr(0, i), screeWidth * 0.128 + nameLastEndWidth, screeWidth * 0.453);
                    if (screeWidth * 0.757 - ctx.measureText(name.substr(0, i)).width - nameLastEndWidth < screeWidth * 0.04) {
                        ctx.fillText(
                            "...",
                            screeWidth * 0.128 + ctx.measureText(name.substr(0, i)).width + nameLastEndWidth,
                            screeWidth * 0.453
                        );
                    }
                    nameLastEndWidth = ctx.measureText(name.substr(0, i)).width + nameLastEndWidth;
                    //截取掉字符串
                    name = name.substr(i);
                    break;
                }
            }
        } else {
            ctx.fillText(name, screeWidth * 0.128, screeWidth * 0.453);
        }
        ctx.strokeStyle = "#CBA554";
        ctx.beginPath();
        ctx.setLineDash([3]);
        ctx.moveTo(screeWidth * 0.117, screeWidth * 0.482);
        ctx.lineTo(
            screeWidth * 0.117 + nameLength * screeWidth * 0.0228 > screeWidth * 0.89
                ? screeWidth * 0.89
                : screeWidth * 0.117 + nameLength * screeWidth * 0.0228,
            screeWidth * 0.482
        );
        ctx.stroke();
        ctx.closePath();
        /**画姓名和下划线结束 */
        /**中心文字开始 */
        ctx.font = screeWidth * 0.04 + "px Microsoft YaHei";
        var certificateLastEndWidth = 0;
        var line = 1;
        certificateText.forEach((item, index) => {
            var text = item.string + (index > 0 ? " " : "");
            while (text.length > 0) {
                for (var i = text.length; i >= 0; i--) {
                    if (ctx.measureText(text.substring(0, i)).width + certificateLastEndWidth < screeWidth * 0.757) {
                        ctx.fillStyle = item.color;
                        ctx.fillText(
                            text.substring(0, i),
                            screeWidth * 0.128 + certificateLastEndWidth,
                            screeWidth * (0.525 + line * 0.061)
                        );
                        if (
                            screeWidth * 0.757 - ctx.measureText(text.substring(0, i)).width - certificateLastEndWidth <
                            screeWidth * 0.04
                        ) {
                            //不足写下一个字
                            certificateLastEndWidth = 0;
                            line++;
                        } else {
                            //这一行可以继续写
                            certificateLastEndWidth = ctx.measureText(text.substring(0, i)).width + certificateLastEndWidth;
                        }
                        //截取掉字符串
                        text = text.substring(i);
                        break;
                    }
                }
            }
        });
        /**中心文字结束 */
        /**落款开始,计算下宽度保证靠右*/
        ctx.fillStyle = "#1e2235";
        ctx.font = screeWidth * 0.04 + "px Microsoft YaHei";
        var orgNameWidth = ctx.measureText(orgName).width;
        if (orgNameWidth > screeWidth * 0.757) {
            var orgLastEndWidth = 0;
            // eslint-disable-next-line
      for (var i = orgName.length; i >= 0; i--) {
                if (ctx.measureText(orgName.substr(0, i)).width + orgLastEndWidth < screeWidth * 0.757) {
                    ctx.fillText(orgName.substr(0, i), screeWidth * 0.128 + orgLastEndWidth, screeWidth * 1.098);
                    orgLastEndWidth = ctx.measureText(orgName.substr(0, i)).width + orgLastEndWidth;
                    //截取掉字符串
                    name = name.substr(i);
                    break;
                }
            }
        } else {
            ctx.fillText(orgName, screeWidth * 0.86 - orgNameWidth, screeWidth * 1.098);
        }
        /**落款结束 */

        /**日期开始 */
        ctx.fillStyle = "#1e2235";
        ctx.font = screeWidth * 0.04 + "px Microsoft YaHei";
        ctx.fillText(getFullDate(), screeWidth * 0.5558, screeWidth * 1.152);
        /**日期结束 */

        /**公章开始 */
        var lcImg = new Image();
        lcImg.src = params.sealUrl + "?time=" + new Date().getTime();
        lcImg.setAttribute("crossOrigin", "Anonymous");
        lcImg.onload = () => {
            ctx.drawImage(lcImg, screeWidth * 0.623, screeWidth * 1.008, screeWidth * 0.197, screeWidth * 0.197); //画公章
            /**公章结束 */
            /**底部文字开始 */
            ctx.fillStyle = "#ffffff";
            ctx.font = screeWidth * 0.032 + "px Microsoft YaHei";
            ctx.fillText("扫描二维码获取详情", screeWidth * 0.304, screeWidth * 1.384);
            /**底部文字结束 */
            /**底部二维码后面矩形框开始 */
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(screeWidth * 0.061, screeWidth * 1.269, screeWidth * 0.192, screeWidth * 0.192);
            /**底部二维码后面矩形框结束 */
            /**底部二维码开始 */
            var donationCodeImg = new Image();
            donationCodeImg.src = params.codeUrl;
            donationCodeImg.onload = () => {
                ctx.drawImage(donationCodeImg, screeWidth * 0.066, screeWidth * 1.274, screeWidth * 0.181, screeWidth * 0.181);
                /**底部二维码结束 */
                callback(canvas.toDataURL("image/png"));
            };
        };
    };
};

/**处理证书文字描述*/
export const handleStr = (text, params) => {
    var reg = /\{{(.+?)\}}/g;
    var arr = text.match(reg);
    var temp = text.split(/\{{(.+?)\}}/g);
    var info = [];
    for (const key in temp) {
        if (temp[key] && temp[key] != "") {
            info.push(temp[key]);
        }
    }
    var res = [{ string: "     ", color: "#000000" }];
    for (const item of info) {
        var value = arr.find((val) => val.indexOf(item) != -1);
        if (value) {
            //捐赠成功
            if (value == "{{捐赠时间}}") {
                res.push({
                    string: getFullDate(params.payTime),
                    color: "#FF4444",
                });
            } else if (value == "{{项目名称}}") {
                res.push({
                    string: params.projectName.toString(),
                    color: "#FF4444",
                });
            } else if (value == "{{捐赠金额}}") {
                res.push({
                    string: params.amount.toString(),
                    color: "#FF4444",
                });
            } else if (value == "{{用户名称}}") {
                res.push({
                    string: params.userName.toString(),
                    color: "#FF4444",
                });
            }
        } else {
            res.push({ string: item, color: "#000000" });
        }
    }
    return res;
};

/**获取真实的字符长度 */
export const getTrueLength = (str) => {
    var len = str.length,
        truelen = 0;
    for (var x = 0; x < len; x++) {
        if (str.charCodeAt(x) > 128) {
            truelen += 2;
        } else {
            truelen += 1;
        }
    }
    return truelen;
};

/** 获取当前/指定时间的特定格式 年/月/日
 * @param {String} datetime 时间
 * @return {String}
 */
export const getFullDate = (datetime = null) => {
    var newDate = datetime ? new Date(datetime) : new Date();
    var month = newDate.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    return newDate.getFullYear() + "年" + month + "月" + newDate.getDate() + "日";
};
