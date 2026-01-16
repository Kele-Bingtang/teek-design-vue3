import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export type Recordable<T = any> = Record<string, T>;

export function isDevFn(mode: string): boolean {
  return mode === "development";
}

export function isProdFn(mode: string): boolean {
  return mode === "production";
}

/**
 * 是否开启生成 package 报告
 */
export function isReportMode(): boolean {
  return process.env.VITE_REPORT === "true";
}

/**
 * 重新解析 .env 的内容，重新封装类型，比如 .env 定义了 true，false，默认为字符串类型，需要转换为 boolean 类型
 */
export function wrapperEnv(envConf: Recordable): ImportMetaEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    // 将 true 和 false 字符串转换为布尔值
    realName = realName === "true" ? true : realName === "false" ? false : realName;

    // 指定变量名进行类型转换
    if (envName === "VITE_PORT") realName = Number(realName);
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

/**
 * 从环境变量文件里获取变量值
 *
 * @param match 前缀
 * @param confFiles 文件列表
 */
export function getEnvConfig(match = "VITE_", confFiles = [".env", ".env.production", ".env.sit", ".env.uat"]) {
  let envConfig = {};
  confFiles.forEach(item => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (error) {
      console.error(`Error in parsing ${item}`, error);
    }
  });

  Object.keys(envConfig).forEach(key => {
    const reg = new RegExp(`^(${match})`);
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

/**
 * 获取项目根路径
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}
