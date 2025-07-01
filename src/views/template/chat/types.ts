export interface Person {
  /** 唯一标识 */
  id: number;
  /** 名称 */
  name: string;
  /** 邮箱 */
  email: string;
  /** 头像 */
  avatar: string;
  /** 是否在线 */
  online?: boolean;
  /** 最后时间 */
  lastTime: string;
  /** 未读消息数 */
  unread?: number;
}

export interface Message {
  /** 唯一标识 */
  id: number;
  /** 发送者 */
  sender: string;
  /** 内容 */
  content: string;
  /** 时间 */
  time: string;
  /** 是否是当前用户发送 */
  isMe: boolean;
  /** 头像 */
  avatar: string;
}
