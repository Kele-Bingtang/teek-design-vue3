import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import FormMain from "./src/form-main.vue";

export type * from "./src/types";

export * from "./src/composables";

export const ProForm = useInstall(index);
export const ProFormMain = useInstall(FormMain);

export default index;
