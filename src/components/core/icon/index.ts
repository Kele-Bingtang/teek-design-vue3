import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import SvgIcon from "./src/components/svg-icon.vue";
import FontIcon from "./src/components/font-icon.vue";
import IconifyOnline from "./src/components/iconify-online.vue";
import IconifyOffline from "./src/components/iconify-offline.vue";

export { SvgIcon, FontIcon, IconifyOnline, IconifyOffline };

export type * from "./src/types";

export * from "./src/create-icon";
export { addCollection, addIcon, Icon as IconifyIcon, listIcons } from "@iconify/vue";

export const Icon = useInstall(index);

export default index;
