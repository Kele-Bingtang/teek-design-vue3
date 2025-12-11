import type { RequestConfig } from "../types";
import qs from "qs";
import { ContentTypeEnum } from "../http-enum";
import { isObject } from "@/common/utils";

/**
 * 根据 params 的 type 属性设置不同的 Content-Type，并处理 data 格式
 * @param config Axios 配置信息
 */
export const processContentType = (config: RequestConfig) => {
  const type = config.contentType;

  switch (type) {
    case "form": {
      config.headers["Content-Type"] = ContentTypeEnum.FORM_URLENCODED;
      config.data = qs.stringify(config.data);
      return;
    }
    case "file": {
      config.headers["Content-Type"] = ContentTypeEnum.FILE_FORM_DATA;
      return;
    }
    case "multipart": {
      config.headers["Content-Type"] = ContentTypeEnum.Multi_FILE_FORM_DATA;
      return;
    }
    case "text": {
      config.headers["Content-Type"] = ContentTypeEnum.TEXT;
      return;
    }
    case "xml": {
      config.headers["Content-Type"] = ContentTypeEnum.XML;
      return;
    }
    case "stream": {
      config.headers["Content-Type"] = ContentTypeEnum.OCTET_STREAM;
      return;
    }
    default: {
      // 默认使用 JSON 类型
      config.headers["Content-Type"] = ContentTypeEnum.JSON;
      // 仅当 data 为对象时才序列化，避免重复序列化
      if (config.data && isObject(config.data) && !(config.data instanceof FormData)) {
        config.data = JSON.stringify(config.data);
      }
      return;
    }
  }
};

/**
 * 获取参数序列化器
 *
 * brackets: ids[]=1&ids[]=2&ids[]=3
 * comma: ids=1,2,3
 * indices: ids[0]=1&ids[1]=2&ids[2]=3
 * repeat: ids=1&ids=2&ids=3
 */
export const getParamsSerializer = (paramsType: RequestConfig["paramsType"]) => {
  switch (paramsType) {
    case "brackets": {
      return (params: any) => qs.stringify(params, { arrayFormat: "brackets" });
    }
    case "comma": {
      return (params: any) => qs.stringify(params, { arrayFormat: "comma" });
    }
    case "indices": {
      return (params: any) => qs.stringify(params, { arrayFormat: "indices" });
    }
    case "repeat": {
      return (params: any) => qs.stringify(params, { arrayFormat: "repeat" });
    }
    default: {
      return (params: any) => params;
    }
  }
};
