interface Log {
  base: (text: any) => void;
  info: (textOrTitle: any, content?: any) => void;
  primary: (textOrTitle: any, content?: any) => void;
  success: (textOrTitle: any, content?: any) => void;
  warning: (textOrTitle: any, content?: any) => void;
  danger: (textOrTitle: any, content?: any) => void;
  error: (content: any) => void;
  table: (data: any[]) => void;
  picture: (url: string, scale?: number) => void;
}

declare global {
  interface Navigator {
    browserLanguage: string;
  }
  interface Window {
    webkitCancelAnimationFrame;
    mozCancelAnimationFrame;
    oCancelAnimationFrame;
    msCancelAnimationFrame;
    webkitRequestAnimationFrame;
    mozRequestAnimationFrame;
    oRequestAnimationFrame;
    msRequestAnimationFrame;
    __HMR_FIRST_UPDATE__: boolean;
    log: Log;
  }

  /**
   * 平台的名称、版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    lastBuildTime: string;
  };

  const log: Log;
}

export {}; // 扩展 global 而不是覆盖
