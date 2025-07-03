/**
 * 打印指定 DOM 内容
 *
 * @param dom 要打印的 DOM 元素或 CSS 选择器
 * @param options 配置项
 */
export function printElement(
  dom: string | HTMLElement,
  options: {
    styleStr?: string; // 自定义样式字符串
    setDomHeightArr?: string[]; // 需要固定高度的元素选择器数组
    beforePrint?: () => void; // 打印前回调
    afterPrint?: () => void; // 打印后回调
  } = {}
): void {
  const { styleStr = "", setDomHeightArr = [], beforePrint, afterPrint } = options;

  let element: HTMLElement | null = null;

  if (typeof dom === "string") {
    element = document.querySelector(dom);
  } else if (dom instanceof HTMLElement) {
    element = dom;
  }

  if (!element) {
    console.error("未找到可打印的 DOM 元素");
    return;
  }

  // 设置需要固定高度的子元素
  if (setDomHeightArr.length) {
    setDomHeight(setDomHeightArr);
  }

  // 构建打印内容
  const content = `
    <html>
      <head>
        <style>
          ${getComputedStyle()}
        </style>
        ${styleStr}
      </head>
      <body>
        ${cloneContent(element)}
      </body>
    </html>
  `;

  // 创建 iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.top = "-10px";
  iframe.style.left = "-10px";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error("无法获取 iframe 文档对象");
    return;
  }

  iframeDoc.open();
  iframeDoc.write(content);
  iframeDoc.close();

  // 处理生命周期回调
  const handleBeforePrint = () => {
    beforePrint?.();
  };

  const handleAfterPrint = () => {
    setTimeout(() => {
      document.body.removeChild(iframe);
      afterPrint?.();
    }, 100);
  };

  // 监听加载完成
  iframe.onload = () => {
    handleBeforePrint();

    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.onafterprint = handleAfterPrint;
        iframe.contentWindow.print(); // 触发打印
      }
    } catch (error) {
      console.error("打印过程中发生错误", error);
      handleAfterPrint();
    }
  };
}

/**
 * 获取当前页面所有样式
 */
function getComputedStyle(): string {
  const styles = document.querySelectorAll("style, link[rel='stylesheet']");
  let result = "";

  styles.forEach(style => {
    result += style.outerHTML;
  });

  return result;
}

/**
 * 拷贝表单控件的值到 DOM 属性中（如 input value -> value 属性）
 */
function cloneContent(dom: HTMLElement): string {
  const tmpNode = dom.cloneNode(true) as HTMLElement;
  const inputs = tmpNode.querySelectorAll("input");
  const textareas = tmpNode.querySelectorAll("textarea");
  const selects = tmpNode.querySelectorAll("select");
  const canvases = tmpNode.querySelectorAll("canvas");

  // 同步 input 值
  inputs.forEach(input => {
    if (input.type === "checkbox" || input.type === "radio") {
      input.setAttribute("checked", `${input.checked}`);
    } else {
      input.setAttribute("value", input.value);
    }
  });

  // 同步 textarea 值
  textareas.forEach(textarea => {
    textarea.textContent = textarea.value;
  });

  // 同步 select 值
  selects.forEach(select => {
    const selectedOption = select.querySelector("option:checked");
    if (selectedOption) {
      selectedOption.setAttribute("selected", "selected");
    }
  });

  // 替换 canvas 为 img
  canvases.forEach(canvas => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.style.maxWidth = "100%";
    img.className = "isNeedRemove";

    if (canvas.parentNode) {
      canvas.parentNode.insertBefore(img, canvas.nextSibling);
      canvas.parentNode.removeChild(canvas);
    }
  });

  // 移除临时添加的元素
  const removes = tmpNode.querySelectorAll(".isNeedRemove");
  removes.forEach(el => el.remove());

  // 返回 HTML 字符串
  return tmpNode.outerHTML;
}

/**
 * 设置指定 DOM 的高度为当前 offsetHeight
 */
function setDomHeight(selectors: string[]): void {
  selectors.forEach(selector => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach(el => {
      el.style.height = `${el.offsetHeight}px`;
    });
  });
}
