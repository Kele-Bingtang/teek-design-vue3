# Teek Design Vue3

[Github](https://github.com/Kele-Bingtang/teek-design-vue3) ｜ [Gitee](https://gitee.com/kele-bingtang/teek-design-vue3) ｜ [Preview](https://vue3-design.teek.top/) ｜[Docs](https://vue3-design-docs.teek.top/)

<p align="center">
  <a title="Github release" target="_blank" href="https://github.com/Kele-Bingtang/teek-design-vue3/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Kele-Bingtang/teek-design-vue3?logo=github">
  </a>

  <img src="https://img.shields.io/badge/v20.x-x?logo=node.js&label=node" alt="node version">
  <img src="https://img.shields.io/github/languages/code-size/Kele-Bingtang/teek-design-vue3?logo=Visual Studio Code&logoColor=blue" alt="GitHub code size in bytes">

  <a title="GitHub Discussions" target="_blank" href="https://github.com/Kele-Bingtang/teek-design-vue3/discussions">
    <img src="https://img.shields.io/github/discussions/Kele-Bingtang/teek-design-vue3?color=9cf&logo=github" alt="GitHub Discussions">
  </a>

  <a title="MIT License" target="_blank" href="https://github.com/Kele-Bingtang/teek-design-vue3/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License">
  </a>
</p>

**简体中文** | [English](./README.en.md)

Teek 是一个基于 [Vue3](https://github.com/vuejs/core)、[TypeScript](https://www.typescriptlang.org/)、[Vite](https://github.com/vitejs/vite)、[ElementPlus](https://element-plus.org/zh-CN) 构建的颜值强大、功能丰富、开箱即用的中后台管理系统解决方案。

该仓库为完整版，有完整的使用实例代码。精简版请看 [Teek Design Vue3 Template](https://github.com/Kele-Bingtang/teek-design-vue3-template)。

## 使用文档

[使用文档](https://vue3-design-docs.teek.top/)

## 效果在线预览

[Teek Design Vue3](https://vue3-design.teek.top/)

## 效果图

下面只列出部分效果图，更多的功能请访问 [Teek Design Vue3](https://vue3-design.teek.top/)

![](https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/teek-design/20250807012638.png)

![](https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/teek-design/20250807013426.png)

![](https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/teek-design/20250807012653.png)

## 核心特性

- 界面美观实用：精心优化前端界面，项目结构清晰，代码简单易读，使项目更易于上手和学习
- 规范工程化工作流：配置 `Eslint`、`Prettier`、`Husky`、`Commitlint`、`Lint-staged` 规范前端工程代码规范，提高代码质量和团队协作效率
- 完善的打包优化方案：内置规范的打包目录，提供打包压缩功能，减少打包体积，提升应用加载速度和用户体验
- 丰富的组件系统：提供丰富的 `ElementPlus` 超级组件、页面级组件、编辑器组件，基于 `ElementPlus` 的表格、表单、描述列表组件进一步封装，采用 JSON 配置项驱动的方式，快速构建页面
- 丰富的组合式函数：提供丰富常用的 `Composables（Hooks）` 函数封装，实现复用思想，减少重复开发，提高效率
- 个性化主题配置：提供强大丰富的 `CSS` 主题变量、布局变量，支持主题色、浅色、深色、色弱等模式切换，满足不同用户的视觉偏好
- 灵活的布局系统：提供纵向、经典、横向、分栏、混合、嵌入六大布局切换，满足不同业务场景的界面需求。支持浅色/深色模式自由切换，以及自定义主题色配置
- 完善的权限管控：采用 `RBAC` 权限管控模型，提供菜单、路由及按钮级别的细粒度权限管理方案，确保系统安全性和访问控制
- 强大的数据展示能力：提供表格、图表、表单等丰富的数据展示和交互组件，满足各种数据可视化需求
- 开箱即用的功能：集成路由、状态管理、网络请求、`Mock` 数据、国际化、`IFrame` 嵌入等常用功能，减少重复开发工作
- 易于扩展的架构设计：模块化设计，便于功能扩展和定制化开发，支持自定义指令和组合式函数
- 国际化支持：内置常用国际化转换函数，支持自定义国际化切换，轻松实现多语言应用
- IFrame 嵌入功能：提供 `IFrame` 嵌入、`IFrame` 缓存、`IFrame` 跳转等功能，可作为 `Portal` 门户、子系统、单页应用解决方案
- 多种图标类型支持：支持 `IconFont`、`SVG`、`Iconify` 等多种图标类型渲染，快速集成市面上最流行的图标库

## 本地开发

安装依赖

```sh
pnpm install
```

编译运行

```sh
pnpm dev
```

项目启动后自动打开浏览器，地址为：`http://localhost:8099/`。

## 项目打包

打包运行（测试环境使用）

```sh
pnpm build:test
```

打包运行（生产环境使用）

```sh
pnpm build
# or
pnpm build:prod
```

## 支持这个项目

如果您正在使用这个项目并感觉这个项目给你带来帮助，或者是想支持我继续开发，您可以通过如下任意方式支持我：

- Star 并分享 [Teek Design Vue3](https://github.com/Kele-Bingtang/teek-design-vue3) 🚀
- 通过以下二维码进行赞助，打赏作者一杯茶 🍵

谢谢！❤️

|                                                                 微信赞赏                                                                  |                                                               微信                                                                |                                                              支付宝                                                               |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/vp-teek-cover/20250807010102.jpg" alt="WeChat Sponsor QRcode" width=180> | <img src="https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/vp-teek-cover/20250807010104.jpg" alt="WeChat QRcode" width=180> | <img src="https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/vp-teek-cover/20250807010106.jpg" alt="Alipay QRcode" width=180> |

您的赞助将帮助 Teek：

- 维护项目的基础设施
- 投入更多时间进行开发
- 提供更好的技术支持
- 开发更多实用功能

## 致谢

❤️ 感谢支持这个项目的朋友，您的每一份帮助都让这个项目变得更好！

❤️ 感谢为这个项目贡献代码的朋友 → [Contributors](https://github.com/Kele-Bingtang/teek-design-vue3/graphs/contributors)
