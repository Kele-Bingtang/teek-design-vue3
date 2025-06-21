import { initDrawer, closeDrawer } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";
import ProDrawer from "./src/index.vue";

export type * from "./src/types";
export { ProDrawer };

export const useDrawer = (ctx?: ComponentInternalInstance) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDrawer } = initDrawer(thisAppContext);

  return { open: showDrawer, close: closeDrawer };
};
