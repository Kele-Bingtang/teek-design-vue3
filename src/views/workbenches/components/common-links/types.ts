export interface CommonLink {
  /** 链接名称 */
  name: string;
  /** 链接描述 */
  desc: string;
  /** 链接图标 */
  icon: string;
  /** 链接地址 */
  url: string;
  /** 是否选中 */
  selected: boolean;
}

export interface CommonLinkTab {
  /** 标签名称 */
  label: string;
  /** 标签值 */
  value: string;
  /** 标签数据 */
  data: CommonLink[];
}
