import { ApiService } from "../index";

class CmsService extends ApiService {
    // 系统信息
    settings(params) {
        return this.$get("settings", params);
    }
}

export default new CmsService("v1", "cms");
