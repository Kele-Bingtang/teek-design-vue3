import { initDialog, closeDialog } from "./src/index";
import { getCurrentInstance, type ComponentInternalInstance } from "vue";
import ProDialog from "./src/index.vue";

export type * from "./src/types";
export { ProDialog };

export const useDialog = (ctx?: ComponentInternalInstance) => {
  const thisAppContext = ctx || (getCurrentInstance() as ComponentInternalInstance);
  const { showDialog } = initDialog(thisAppContext);

  return { open: showDialog, close: closeDialog };
};
