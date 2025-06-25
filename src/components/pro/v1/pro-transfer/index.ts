import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import table from "./src/table.vue";

export const ProTransfer = useInstall(index);
export const ProTableTransfer = useInstall(table);

export default index;
