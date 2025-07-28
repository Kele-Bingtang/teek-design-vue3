import type { PiniaPluginContext } from "pinia";
import { deepClone } from "@/common/utils";

// 默认排除的存储实例
const defaultExcludes = [""];

/**
 * 重置存储实例
 * @param context Pinia 上下文
 */
export const resetSetupStore = (context: PiniaPluginContext) => {
  if (defaultExcludes.includes(context.store.$id)) return;

  const { $state } = context.store;
  const defaultStore = deepClone($state);

  context.store.$reset = () => {
    context.store.$patch(defaultStore);
  };
};
