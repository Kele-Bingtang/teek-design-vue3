import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import tableMain from "./src/components/table-main.vue";

export * from "./src/interface";
export * from "./src/helper";
export { type DialogForm, type ProTableOnEmits } from "./src/index.vue";
export { type DialogFormColumnProps } from "./src/components/dialog-form.vue";
export { useProTable } from "./src/hooks/use-pro-table";

export const ProTable = useInstall(index);
export const TableMain = useInstall(tableMain);

export default index;
