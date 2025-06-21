import type { ElOption, FormItemColumnProps } from "./form-item";
import { isFunction } from "@/utils";
import { formatValue } from "./helper";

/**
 * provide optionsMap key
 */
export const optionsMapKey: InjectionKey<Ref<Map<string, MaybeRef<ElOption[]>>>> = Symbol("optionsMap");

/**
 * 超级组件字典枚举初始化和缓存
 */
export const useOptions = () => {
  // 定义 optionsMap 存储枚举值
  const optionsMap = inject(optionsMapKey, ref(new Map<string, MaybeRef<ElOption[]>>()));

  /**
   * 初始化枚举字典数据
   */
  const initOptionsMap = async (options: FormItemColumnProps["options"], prop: string) => {
    if (!options) return;

    const optionsMapConst = optionsMap.value;

    // 如果当前 enumMap 存在相同的值则 return
    if (optionsMapConst.has(prop) && (isFunction(options) || optionsMapConst.get(prop) === options)) return;

    // 为了防止接口执行慢，导致页面下拉等枚举数据无法填充，所以预先存储为 [] 方便获取，接口返回后再二次存储
    optionsMapConst.set(prop, []);

    // 处理 options 并存储到 optionsMap
    const value = await formatValue<FormItemColumnProps["options"]>(options, [optionsMapConst, prop], false);

    optionsMapConst.set(prop, (value as any)?.data || value);
  };

  return { optionsMap, initOptionsMap };
};
