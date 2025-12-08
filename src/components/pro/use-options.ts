import type { InjectionKey, Ref, MaybeRef } from "vue";
import type { ElOption, FormItemColumnProps, OptionsParams } from "./form-item";
import { inject, ref } from "vue";
import { isArray, isFunction } from "@/common/utils";
import { formatValue, lastProp } from "./helper";

export type OptionsMapType = Map<string, MaybeRef<ElOption[]>>;

/**
 * 提供 optionsMap key
 */
export const optionsMapKey: InjectionKey<Ref<OptionsMapType>> = Symbol("optionsMap");

/**
 * 超级组件字典枚举初始化和缓存
 */
export const useOptions = () => {
  // 定义 optionsMap 存储枚举值
  const optionsMap = inject(optionsMapKey, ref(new Map<string, MaybeRef<ElOption[]>>()));

  /**
   * 初始化枚举字典数据
   */
  const initOptionsMap = async (
    options: FormItemColumnProps["options"],
    prop: string,
    cache = true,
    extra: Omit<OptionsParams, "prop"> = {}
  ) => {
    if (!options || (isArray(options) && !options.length)) return;

    const optionsMapConst = optionsMap.value;
    const lp = lastProp(prop);

    // 如果当前 optionsMap 存在相同的值则 return
    if (cache && optionsMapConst.has(lp) && (isFunction(options) || optionsMapConst.get(lp) === options)) return;

    // 为了防止接口执行慢，导致页面下拉等枚举数据无法填充，所以预先存储为 [] 方便获取，接口返回后再二次存储
    optionsMapConst.set(lp, []);

    // 处理 options 并存储到 optionsMap
    const value = await initOptions(options, { optionsMap: optionsMapConst, lp, ...extra }, false);
    optionsMapConst.set(lp, value);
  };

  const initOptions = async (
    options: FormItemColumnProps["options"],
    params: OptionsParams = {},
    processRef = true
  ) => {
    if (!options || (isArray(options) && !options.length)) return [];

    const result = await formatValue<FormItemColumnProps["options"]>(options, params, processRef);

    // 兼容常用数据格式
    return result?.data || result?.list || result?.data?.list || result || [];
  };

  return { optionsMap, initOptionsMap, initOptions };
};
