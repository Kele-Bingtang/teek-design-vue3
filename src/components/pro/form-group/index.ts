import { useInstall } from "@/common/utils";
import index from "./src/index.vue";

export type * from "./src/types";

export * from "./src/composables";

export const ProFormGroup = useInstall(index);

export default index;
