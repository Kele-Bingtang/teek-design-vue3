import { createI18n } from "vue-i18n";
import { LanguageEnum } from "@/common/enums/appEnum";
import { isObject } from "@/common/utils";
import { useStorage } from "@/composables";
import zhCN from "./locales/zh-CN";
import enUS from "./locales/en-US";

// 动态导入语言文件
const messages = {
  [LanguageEnum.ZhCn]: zhCN,
  [LanguageEnum.EnUs]: enUS,
};

// 多语言选项
export const languageOptions = [
  { value: LanguageEnum.ZhCn, label: "简体中文" },
  { value: LanguageEnum.EnUs, label: "English" },
];

export const getDefaultLocale = async () => {
  await nextTick();
  const layoutStore = useStorage().getStorage("layoutStore");
  const lang = layoutStore?.language || getBrowserLang();

  document.documentElement.lang = lang;
  return lang;
};

/**
 * 获取浏览器默认语言
 */
export const getBrowserLang = () => {
  const browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) return LanguageEnum.ZhCn;
  else return LanguageEnum.EnUs;
};

/**
 * 自定义的国际化转换函数，等价于 vue-i18n 的 $t 或 t
 * 在其他 .ts 文件使用国际化，则使用该函数转换，因为 useI18n 必须在 setup 中使用
 */
export const t = (message: string | Record<string, string>, option?: Record<string, string | number>) => {
  if (!message) return "";

  // message 为 { zh: "", en: "" } 时，直接返回对于语言的值
  if (isObject(message)) {
    const locale = i18n.global.locale;
    return formatTranslate(message[locale.value], option);
  }

  return formatTranslate(i18n.global.t(message), option);
};

const formatTranslate = (message: string, option?: Record<string, string | number>) => {
  if (!option) return message;

  return message.replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
};

const i18n = createI18n({
  legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
  locale: await getDefaultLocale(), // 设置语言类型
  globalInjection: true, // 全局注册 $t 方法
  messages,
});

// 异步加载语言文件

export default i18n;
