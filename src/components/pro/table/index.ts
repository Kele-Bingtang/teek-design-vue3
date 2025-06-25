import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import tableMain from "./src/table-main.vue";
import ElDisplay from "./src/plugins/el-display.vue";

export type * from "./src/types";
export type { UseSelectState } from "./src/composables/use-selection";

export * from "./src/helper";
export * from "./src/composables";

export const ProTable = useInstall(index);
export const ProTableMain = useInstall(tableMain);

export { ElDisplay };

export default index;
