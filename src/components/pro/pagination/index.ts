import { useInstall } from "@/common/utils";
import index, { defaultPaginationInfo } from "./src/index.vue";

export { defaultPaginationInfo };
export type * from "./src/types";

export const Pagination = useInstall(index);

export default index;
