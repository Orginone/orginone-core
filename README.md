## 奥集能核心库


项目分为多个包，使用`lerna`来管理多个包之间的依赖关系。


## 包简介

### `@orginone/core`

核心代码，抽象了包括网络请求、持久化、状态管理之类的框架/环境依赖，可以用于Web, nodejs, 小程序, Electron/nw.js桌面端等多种环境。

### `@orginone/vue`

使用基于`@vue/reactivity`的响应式系统，可以运行在非Web环境。

### `@orginone/vue2`

和`@orginone/vue`类似，但替换成了基于vue 2.7的组合式API。

### `@orginone/react`

使用基于React Hooks的状态管理系统。