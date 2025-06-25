/**
 * 美化打印实现方法
 */
const useLog = () => {
  const isProduction = import.meta.env.MODE === "production";

  const infoColor = "#909399";
  const primaryColor = "#409EFF";
  const successColor = "#67C23A";
  const warningColor = "#E6A23C";
  const errorColor = "#F56C6C";

  const isEmpty = (value: any) => {
    return value == null || value === undefined || value === "";
  };
  const prettyPrint = (title: string, text: string, color: string) => {
    if (isProduction) return;

    if (typeof title === "object" && typeof text === "object") {
      console.log(title, text);
      return;
    }

    if (typeof title === "object") {
      console.log(
        title,
        `%c ${text} %c`,
        `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        "background:transparent"
      );
      return;
    }

    if (typeof text === "object") {
      console.log(
        `%c ${title} %c`,
        `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        "background:transparent",
        text
      );
      return;
    }

    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      "background:transparent"
    );
  };

  const base = (text: any) => {
    console.log(text);
  };

  const info = (textOrTitle: any, content: any = "") => {
    const title = isEmpty(content) ? "Info" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, infoColor);
  };

  const primary = (textOrTitle: any, content: any = "") => {
    const title = isEmpty(content) ? "Info" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, primaryColor);
  };

  const success = (textOrTitle: any, content: any = "") => {
    const title = isEmpty(content) ? "Success " : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, successColor);
  };

  const warning = (textOrTitle: any, content: any = "") => {
    const title = isEmpty(content) ? "Warning" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, warningColor);
  };

  const danger = (textOrTitle: any, content: any = "") => {
    const title = isEmpty(content) ? "Error" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, errorColor);
  };

  const error = (content: any = "") => {
    console.error(content);
  };

  /**
   * 打印表格
   */
  const table = (data: any[]) => {
    data.forEach((row: any) => {
      console.log(
        `%c ${row.id} %c ${row.name} %c ${row.age} `,
        "color: black; background-color: lightgray; padding: 2px 10px;",
        "color: black; background-color: lightgray; padding: 2px 10px;",
        "color: black; background-color: lightgray; padding: 2px 10px;"
      );
    });
  };

  /**
   * 打印图片
   * @param url 图片链接
   * @param scale 图片宽度和高度倍数
   */
  const picture = (url: string, scale = 1) => {
    if (isProduction) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      if (ctx) {
        c.width = img.width;
        c.height = img.height;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        const dataUri = c.toDataURL("image/png");

        console.log(
          `%c sup?`,
          `font-size: 1px;
									padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
									background-image: url(${dataUri});
									background-repeat: no-repeat;
									background-size: ${img.width * scale}px ${img.height * scale}px;
									color: transparent;
									`
        );
      }
    };
    img.src = url;
  };

  return {
    base,
    info,
    primary,
    success,
    warning,
    danger,
    error,
    table,
    picture,
  };
};

// 创建打印对象
const log = useLog();

export default log;
