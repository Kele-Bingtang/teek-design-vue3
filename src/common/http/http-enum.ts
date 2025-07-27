// 请求枚举配置
/**
 * 请求结果枚举
 */
export enum ResultEnum {
  SUCCESS = 200,
  LOGIN = 401,
  TIMEOUT = 10000,
  TYPE = "success",
}

/**
 * 请求方法枚举
 */
export enum RequestMethodEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * 常用的 contentTyp 类型
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // text
  TEXT = "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // 单文件 form-data 上传
  FILE_FORM_DATA = "application/form-data;charset=UTF-8",
  // 多文件 form-data 上传
  Multi_FILE_FORM_DATA = "multipart/form-data;charset=UTF-8",
  // xml
  XML = "application/xml;charset=UTF-8",
  // octet-stream 二进制流数据
  OCTET_STREAM = "application/octet-stream",
}
