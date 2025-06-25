import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import Tree from "./src/components/tree.vue";

export type * from "./src/types";
export * from "./src/helper";

export { Tree };

export const ProFormItem = useInstall(index);

export default index;
