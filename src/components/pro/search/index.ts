import { useInstall } from "@/common/utils";
import index from "./src/index.vue";

export type * from "./src/types";

export * from "./src/composables";

export const ProSearch = useInstall(index);

export type ProSearchInstance = InstanceType<typeof index>;

export default index;
