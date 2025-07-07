<script setup lang="ts" name="VMenus">
import UseDirective from "./components/useDirective.vue";
import UseFunction from "./components/useFunction.vue";
import UseComponent from "./components/useComponent.vue";

const menus = ref([
  {
    label: "返回(B)",
    tip: "Alt+向左箭头",
    click: () => {
      window.history.back();
    },
  },
  {
    label: "点击不关闭菜单",
    tip: "不关闭菜单",
    click: () => {
      return false;
    },
  },
  {
    label: "前进(F)",
    tip: "Alt+向右箭头",
    disabled: true,
  },
  {
    label: "重新加载(R)",
    tip: "Ctrl+R",
    icon: '<svg focusable="false" class="anticon-spin" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"></path></svg>',
    click: () => location.reload(),
    divided: true,
  },
  {
    label: "另存为(A)...",
    tip: "Ctrl+S",
  },
  {
    label: "打印(P)...",
    tip: "Ctrl+P",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M256 768H105.024c-14.272 0-19.456-1.472-24.64-4.288a29.056 29.056 0 0 1-12.16-12.096C65.536 746.432 64 741.248 64 727.04V379.072c0-42.816 4.48-58.304 12.8-73.984 8.384-15.616 20.672-27.904 36.288-36.288 15.68-8.32 31.168-12.8 73.984-12.8H256V64h512v192h68.928c42.816 0 58.304 4.48 73.984 12.8 15.616 8.384 27.904 20.672 36.288 36.288 8.32 15.68 12.8 31.168 12.8 73.984v347.904c0 14.272-1.472 19.456-4.288 24.64a29.056 29.056 0 0 1-12.096 12.16c-5.184 2.752-10.368 4.224-24.64 4.224H768v192H256V768zm64-192v320h384V576H320zm-64 128V512h512v192h128V379.072c0-29.376-1.408-36.48-5.248-43.776a23.296 23.296 0 0 0-10.048-10.048c-7.232-3.84-14.4-5.248-43.776-5.248H187.072c-29.376 0-36.48 1.408-43.776 5.248a23.296 23.296 0 0 0-10.048 10.048c-3.84 7.232-5.248 14.4-5.248 43.776V704h128zm64-448h384V128H320v128zm-64 128h64v64h-64v-64zm128 0h64v64h-64v-64z"></path></svg>',
    click: () => window.print(),
  },
  {
    label: "投射(C)...",
    divided: true,
    children: [
      {
        label: "返回(B)",
        tip: "Alt+向左箭头",
        click: () => {
          window.history.back();
        },
      },
      {
        label: "点击不关闭菜单",
        tip: "不关闭菜单",
        click: () => {
          return false;
        },
      },
      {
        label: "前进(F)",
        tip: "Alt+向右箭头",
        disabled: true,
      },
      {
        label: "重新加载(R)",
        tip: "Ctrl+R",
        icon: '<svg focusable="false" class="anticon-spin" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"></path></svg>',
        click: () => location.reload(),
        divided: true,
      },
      {
        label: "另存为(A)...",
        tip: "Ctrl+S",
      },
      {
        label: "打印(P)...",
        tip: "Ctrl+P",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M256 768H105.024c-14.272 0-19.456-1.472-24.64-4.288a29.056 29.056 0 0 1-12.16-12.096C65.536 746.432 64 741.248 64 727.04V379.072c0-42.816 4.48-58.304 12.8-73.984 8.384-15.616 20.672-27.904 36.288-36.288 15.68-8.32 31.168-12.8 73.984-12.8H256V64h512v192h68.928c42.816 0 58.304 4.48 73.984 12.8 15.616 8.384 27.904 20.672 36.288 36.288 8.32 15.68 12.8 31.168 12.8 73.984v347.904c0 14.272-1.472 19.456-4.288 24.64a29.056 29.056 0 0 1-12.096 12.16c-5.184 2.752-10.368 4.224-24.64 4.224H768v192H256V768zm64-192v320h384V576H320zm-64 128V512h512v192h128V379.072c0-29.376-1.408-36.48-5.248-43.776a23.296 23.296 0 0 0-10.048-10.048c-7.232-3.84-14.4-5.248-43.776-5.248H187.072c-29.376 0-36.48 1.408-43.776 5.248a23.296 23.296 0 0 0-10.048 10.048c-3.84 7.232-5.248 14.4-5.248 43.776V704h128zm64-448h384V128H320v128zm-64 128h64v64h-64v-64zm128 0h64v64h-64v-64z"></path></svg>',
        click: () => window.print(),
      },
      {
        label: "投射(C)...",
        divided: true,
      },
      {
        label: "发送到你的设备",
        icon: '<svg focusable="false" class="" data-icon="windows" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M120.1 770.6L443 823.2V543.8H120.1v226.8zm63.4-163.5h196.2v141.6l-196.2-31.9V607.1zm340.3 226.5l382 62.2v-352h-382v289.8zm63.4-226.5h255.3v214.4l-255.3-41.6V607.1zm-63.4-415.7v288.8h382V128.1l-382 63.3zm318.7 225.5H587.3V245l255.3-42.3v214.2zm-722.4 63.3H443V201.9l-322.9 53.5v224.8zM183.5 309l196.2-32.5v140.4H183.5V309z"></path></svg>',
        children: [
          {
            label: "iPhone",
          },
          {
            label: "iPad",
          },
          {
            label: "Windows 11",
          },
        ],
      },
      {
        label: "为此页面创建二维码",
        divided: true,
        icon: '<svg focusable="false" class="" data-icon="qrcode" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M468 128H160c-17.7 0-32 14.3-32 32v308c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V136c0-4.4-3.6-8-8-8zm-56 284H192V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210H136c-4.4 0-8 3.6-8 8v308c0 17.7 14.3 32 32 32h308c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zm-56 284H192V612h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm590-630H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V160c0-17.7-14.3-32-32-32zm-32 284H612V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210h-48c-4.4 0-8 3.6-8 8v134h-78V556c0-4.4-3.6-8-8-8H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h78v102c0 4.4 3.6 8 8 8h190c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zM746 832h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm142 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path></svg>',
      },
      {
        label: "使用网页翻译(F)",
        divided: true,
        children: [
          { label: "翻译成繁体中文" },
          { label: "翻译成繁体中文" },
          {
            label: "百度翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
          {
            label: "搜狗翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
          {
            label: "有道翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
        ],
      },
      {
        label: "截取网页(R)",
      },
      { label: "查看网页源代码(U)", tip: "Ctrl+U" },
      { label: "检查(N)", tip: "Ctrl+Shift+I" },
    ],
  },
  {
    label: "发送到你的设备",
    icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
    children: [
      {
        label: "iPhone",
      },
      {
        label: "iPad",
      },
      {
        label: "Windows 11",
      },
    ],
  },
  {
    label: "为此页面创建二维码",
    divided: true,
    icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
  },
  {
    label: "使用网页翻译(F)",
    divided: true,
    children: [
      { label: "翻译成繁体中文" },
      { label: "翻译成繁体中文" },
      {
        label: "百度翻译",
        children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
      },
      {
        label: "搜狗翻译",
        children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
      },
      {
        label: "有道翻译",
        children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
      },
    ],
  },
  {
    label: "截取网页(R)",
    children: [
      {
        label: "返回(B)",
        tip: "Alt+向左箭头",
        click: () => {
          window.history.back();
        },
      },
      {
        label: "点击不关闭菜单",
        tip: "不关闭菜单",
        click: () => {
          return false;
        },
      },
      {
        label: "前进(F)",
        tip: "Alt+向右箭头",
        disabled: true,
      },
      {
        label: "重新加载(R)",
        tip: "Ctrl+R",
        icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
        click: () => location.reload(),
        divided: true,
      },
      {
        label: "另存为(A)...",
        tip: "Ctrl+S",
      },
      {
        label: "打印(P)...",
        tip: "Ctrl+P",
        icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
        click: () => window.print(),
      },
      {
        label: "投射(C)...",
        divided: true,
      },
      {
        label: "发送到你的设备",
        icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
        children: [
          {
            label: "iPhone",
          },
          {
            label: "iPad",
          },
          {
            label: "Windows 11",
          },
        ],
      },
      {
        label: "为此页面创建二维码",
        divided: true,
        icon: '<svg focusable="false" class="" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>',
      },
      {
        label: "使用网页翻译(F)",
        divided: true,
        children: [
          { label: "翻译成繁体中文" },
          { label: "翻译成繁体中文" },
          {
            label: "百度翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
          {
            label: "搜狗翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
          {
            label: "有道翻译",
            children: [{ label: "翻译成繁体中文" }, { label: "翻译成繁体中文" }],
          },
        ],
      },
      {
        label: "截取网页(R)",
      },
      { label: "查看网页源代码(U)", tip: "Ctrl+U" },
      { label: "检查(N)", tip: "Ctrl+Shift+I" },
    ],
  },
  { label: "查看网页源代码(U)", tip: "Ctrl+U" },
  { label: "检查(N)", tip: "Ctrl+Shift+I" },
]);

const menusItemOptions = [
  { field: "label", desc: "菜单项名称", type: "string", require: true, default: "-" },
  { field: "style", desc: "每一项菜单的自定义样式", type: "object", require: false, default: "{}" },
  {
    field: "icon",
    desc: "图标参数，内部支持 html 字符串图标，传入组件时需要实现 icon 插槽",
    type: "string | 其他类型",
    require: false,
    default: "undefined",
  },
  { field: "disabled", desc: "是否禁用菜单项", type: "boolean", require: false, default: "undefined" },
  { field: "divided", desc: "是否显示分割线", type: "boolean", require: false, default: "undefined" },
  { field: "tip", desc: "没项菜单后面的小提示", type: "string", require: false, default: "undefined" },
  { field: "hidden", desc: "是否隐藏该项", type: "boolean", require: false, default: "undefined" },
  { field: "children", desc: "子菜单列表信息", type: "MenusItemOptions[]", require: false, default: "undefined" },
  {
    field: "enter",
    desc: "菜单项移入事件，返回 null 或 false 不展开子菜单",
    type: "Function()",
    require: false,
    default: "undefined",
  },
  {
    field: "click",
    desc: "菜单项点击事件，返回 null 或 false 不关闭菜单",
    type: "Function()",
    require: false,
    default: "undefined",
  },
];

const directiveAndFunctions = [
  { field: "menus", desc: "菜单列表信息", type: "MenusItemOptions[]", require: "true", default: "[]" },
  { field: "menusClass", desc: "菜单外层 div 的 class 名", type: "string", require: "false", default: "null" },
  { field: "itemClass", desc: "菜单每一项的 class 名", type: "string", require: "false", default: "null" },
  { field: "minWidth", desc: "菜单容器最小宽度", type: "number | string", require: "false", default: "none" },
  { field: "maxWidth", desc: "菜单容器最打宽度", type: "number | string", require: "false", default: "none" },
  { field: "zIndex", desc: "菜单层级", type: "number | string", require: "false", default: "3" },
  { field: "direction", desc: "菜单打开方向", type: "left | right", require: "false", default: "right" },
];

const components = [
  { field: "menus", desc: "菜单列表信息", type: "MenusItemOptions[]", require: "true", default: "[]" },
  {
    field: "event",
    desc: "鼠标事件信息(指令使用时不传)",
    type: "Event",
    require: "与 position 必填一项",
    default: "{}",
  },
  {
    field: "menusClass",
    desc: "菜单外层 div 的 class 名",
    type: "string",
    require: "false",
    default: "null",
    slot: "",
  },
  { field: "itemClass", desc: "菜单每一项的 class 名", type: "string", require: "false", default: "null", slot: "" },
  { field: "minWidth", desc: "菜单容器最小宽度", type: "number | string", require: "false", default: "none", slot: "" },
  { field: "maxWidth", desc: "菜单容器最打宽度", type: "number | string", require: "false", default: "none", slot: "" },
  { field: "zIndex", desc: "菜单层级", type: "number | string", require: "false", default: "3", slot: "" },
  { field: "direction", desc: "菜单打开方向", type: "left | right", require: "false", default: "right", slot: "" },
  { field: "open", desc: "控制菜单组件显示", type: "boolean", require: "true", default: "false", slot: "" },
  { field: "args", desc: "附加参数", type: "unknown", require: "false", default: "undefined", slot: "" },
  {
    field: "default",
    desc: "默认插槽",
    type: "Slot",
    require: "false",
    default: "-",
    slot: "activeIndex: 当前选中索引, menu: 当前菜单项 MenusItemOptions, index: 当前菜单索引",
  },
  {
    field: "args",
    desc: "附加参数",
    type: "Slot",
    require: "false",
    default: "-",
    slot: "activeIndex: 当前选中索引, menu: 当前菜单项 MenusItemOptions, index: 当前菜单索引",
  },
  {
    field: "label",
    desc: "菜单标题插槽",
    type: "Slot",
    require: "false",
    default: "",
    slot: "activeIndex: 当前选中索引, menu: 当前菜单项 MenusItemOptions, index: 当前菜单索引",
  },
  {
    field: "suffix",
    desc: "菜单后缀插槽",
    type: "Slot",
    require: "false",
    default: "-",
    slot: "activeIndex: 当前选中索引, menu: 当前菜单项 MenusItemOptions, index: 当前菜单索引",
  },
];

const directives = [
  { field: "v-menus", desc: "绑定元素右击打开菜单", type: "MenuOptions", require: "true", default: "-" },
  { field: "v-menus:all", desc: "绑定元素左右击均可打开菜单", type: "MenuOptions", require: "true", default: "-" },
  { field: "v-menus:left", desc: "绑定元素左击打开", type: "MenuOptions", require: "true", default: "-" },
  { field: "v-menus:right", desc: "绑定元素右击打开", type: "MenuOptions", require: "true", default: "-" },
];
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card shadow="never" class="v-menus-container tk-card-minimal">
      <template #header>
        <span class="font-medium">
          <el-link
            href="https://www.npmjs.com/package/vue3-menus?activeTab=readme"
            target="_blank"
            style="font-size: 20px"
          >
            vue3-menus 插件
          </el-link>
        </span>
      </template>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <UseDirective :menus="menus" />
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <UseFunction :menus="menus" />
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
          <UseComponent :menus="menus" />
        </el-col>
      </el-row>
      <h2>单个菜单项参数MenusItemOptions</h2>
      <el-table :data="menusItemOptions" highlight-current-row border>
        <el-table-column prop="field" label="属性"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="require" label="是否必填"></el-table-column>
        <el-table-column prop="default" label="默认值"></el-table-column>
      </el-table>
      <h2>指令与方法使用参数</h2>
      <el-table :data="directiveAndFunctions" highlight-current-row border>
        <el-table-column prop="field" label="属性"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="require" label="是否必填"></el-table-column>
        <el-table-column prop="default" label="默认值"></el-table-column>
      </el-table>
      <h2>组件使用参数</h2>
      <el-table :data="components" highlight-current-row border>
        <el-table-column prop="field" label="属性"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="require" label="是否必填"></el-table-column>
        <el-table-column prop="default" label="默认值"></el-table-column>
        <el-table-column prop="slot" label="插槽传入值"></el-table-column>
      </el-table>
      <h2>指令使用配置</h2>
      <h4>配置参数与方法使用相同</h4>
      <el-table :data="directives" highlight-current-row border>
        <el-table-column prop="field" label="指令使用方式"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="require" label="是否必填"></el-table-column>
        <el-table-column prop="default" label="默认值"></el-table-column>
      </el-table>
    </el-card>
  </el-space>
</template>

<style lang="scss">
.v-menus-container {
  .#{$el-namespace}-table tr th .cell {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
  }

  h2 {
    margin: 16px 0;
    font-size: 22px;
    font-weight: 700;
  }
}
</style>
