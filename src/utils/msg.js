import { Message } from "element-ui";
import { getType } from "./type";

let lastSuccessMsg = "";
let lastWarningMsg = "";
let lastInfoMsg = "";
let lastErrorMsg = "";

export function successMsg(options) {
    const type = getType(options);
    const msg = type === "string" ? options : options.message;
    if (msg === lastSuccessMsg && [...document.querySelectorAll(".el-message__content")].some((item) => item.innerText === msg)) {
        return;
    }
    lastSuccessMsg = msg;
    Message.success(options);
}

export function warningMsg(options) {
    const type = getType(options);
    const msg = type === "string" ? options : options.message;
    if (msg === lastWarningMsg && [...document.querySelectorAll(".el-message__content")].some((item) => item.innerText === msg)) {
        return;
    }
    lastWarningMsg = msg;
    Message.warning(options);
}

export function infoMsg(options) {
    const type = getType(options);
    const msg = type === "string" ? options : options.message;
    if (msg === lastInfoMsg && [...document.querySelectorAll(".el-message__content")].some((item) => item.innerText === msg)) {
        return;
    }
    lastInfoMsg = msg;
    Message.info(options);
}

export function errorMsg(options) {
    const type = getType(options);
    const msg = type === "string" ? options : options.message;
    if (msg === lastErrorMsg && [...document.querySelectorAll(".el-message__content")].some((item) => item.innerText === msg)) {
        return;
    }
    lastErrorMsg = msg;
    Message.error(options);
}
