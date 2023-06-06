# `@orginone/core`

核心代码，抽象了包括网络请求、持久化、状态管理之类的框架/环境依赖，可以用于Web, nodejs, 小程序, Electron/nw.js桌面端等多种环境。

## 项目结构

```
src
  ├ config 【抽象】配置
  ├ di 依赖注入
  ├ lib 奥集能业务逻辑包
  │  ├ api 网络API封装
  │  ├ base 业务通用类型
  │  ├ domain 业务领域代码
  │  │  ├ xx xx领域
  │  │  └ yy yy领域
  │  └ store 存储类型定义
  ├ network 【抽象】网络
  ├ state 【抽象】状态管理
  ├ storage 【抽象】持久化
  ├ types 通用类型
  ├ App.ts 应用
  └ index.ts 入口
```