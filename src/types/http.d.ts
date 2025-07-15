declare namespace httpNs {
  interface Response<T = any> {
    /**
     * 状态码
     */
    code: number;
    /**
     * 状态码信息
     */
    status: string;
    /**
     * 消息
     */
    message: string;
    /**
     * 数据
     */
    data: T;
  }
}
