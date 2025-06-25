import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import gridItem from "./src/components/grid-item.vue";

export type * from "./src/types";

export const Grid = useInstall(index);
export const GridItem = useInstall(gridItem);

export default index;
