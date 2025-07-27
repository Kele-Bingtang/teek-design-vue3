/**
 * 校验网络请求状态码
 * @param status 状态码
 */
export const checkStatus = (status: number) => {
  switch (status) {
    case 400: {
      return "请求失败！请您稍后重试";
    }
    case 401: {
      return "登录失效！请您重新登录";
    }
    case 403: {
      return "当前账号无权限访问！";
    }
    case 404: {
      return "你所访问的资源不存在！";
    }
    case 405: {
      return "请求方式错误！请您稍后重试";
    }
    case 408: {
      return "请求超时！请您稍后重试";
    }
    case 500: {
      return "服务异常！";
    }
    case 502: {
      return "网关错误！";
    }
    case 503: {
      return "服务不可用！";
    }
    case 504: {
      return "网关超时！";
    }
    default:
      return "请求失败！";
  }
};
