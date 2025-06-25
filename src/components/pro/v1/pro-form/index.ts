import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
export type { ProFormProps, ProFormOnEmits } from "./src/index.vue";
import Tree from "./src/components/tree.vue";
import ProFormItem from "./src/components/pro-form-item.vue";

export * from "./src/interface";
export * from "./src/helper";
export { useProForm } from "./src/hooks/use-pro-form";

export { Tree, ProFormItem };

export const ProForm = useInstall(index);

export default index;
