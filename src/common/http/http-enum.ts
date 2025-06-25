// 请求枚举配置
/**
 * 请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 10000,
  TYPE = "success",
}

/**
 * 请求方法
 */
export enum RequestEnum {
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
}
