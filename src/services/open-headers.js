import store from "@/store";

export function getOpenCenterHeaders() {
    const { entId, token } = store.state.user.userinfo;
    return {
        entId,
        token,
    };
}
