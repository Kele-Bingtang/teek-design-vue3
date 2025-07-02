// iconfont 图标提取工具

export interface IconfontType {
  className: string;
  unicode?: string;
}

/**
 * 提取单个 CSS 规则中的 iconfont 信息
 */
function extractIconFromRule(rule: CSSRule): IconfontType | null {
  if (!(rule instanceof CSSStyleRule)) return null;

  const { selectorText, style } = rule;
  // 只处理以 .iconfont-sys- 开头且包含 ::before 的选择器
  if (!selectorText?.startsWith(".iconfont-sys-") || !selectorText.includes("::before")) return null;

  const className = selectorText.substring(1, selectorText.indexOf("::before"));
  const content = style.getPropertyValue("content");
  if (!content) return null;

  const unicode = content.replace(/['"\\]/g, "");
  return {
    className,
    unicode: unicode ? `&#x${getUnicode(unicode)};` : undefined,
  };
}

/**
 * 提取所有样式表中的 iconfont class 信息
 */
export function extractIconClasses(): IconfontType[] {
  const iconInfos: IconfontType[] = [];
  const processedSheets = new WeakSet<CSSStyleSheet>();

  for (const sheet of Array.from(document.styleSheets)) {
    // 防止跨域或重复处理
    if (processedSheets.has(sheet)) continue;
    processedSheets.add(sheet);

    let rules: CSSRuleList | undefined;
    try {
      rules = sheet.cssRules;
    } catch (error) {
      // 跨域样式表无法访问
      // 只打印一次警告
      if (process.env.NODE_ENV === "development") {
        // 仅开发环境下输出警告
        console.warn("无法读取样式表 cssRules，可能是跨域样式表：", {
          error,
          sheetHref: sheet.href,
        });
      }
      continue;
    }
    if (!rules) continue;

    for (const rule of Array.from(rules)) {
      const iconInfo = extractIconFromRule(rule);
      if (iconInfo) {
        iconInfos.push(iconInfo);
      }
    }
  }

  return iconInfos;
}

/**
 * 获取字符的 unicode 16 进制字符串
 * @param charCode 字符
 * @returns unicode 字符串
 */
export const getUnicode = (charCode: string): string => {
  if (!charCode) return "";
  return charCode.codePointAt(0)?.toString(16).padStart(4, "0") ?? "";
};
