## 奥集能核心库


项目分为多个包，使用`lerna`来管理多个包之间的依赖关系。


## 包简介

### `@orginone/core`

核心代码，抽象了包括网络请求、持久化、状态管理之类的框架/环境依赖，可以用于Web, nodejs, 小程序, Electron/nw.js桌面端等多种环境。

### 状态和响应式

* `@orginone/vue`

  使用基于`@vue/reactivity`的响应式系统，可以运行在非Web环境。

* `@orginone/vue2`

  和`@orginone/vue`类似，但替换成了基于vue 2.7的组合式API。

* `@orginone/react`

  使用基于React Hooks的状态管理系统。



除此之外，不少其它框架也可以很容易地自行添加相应的支持，例如：

* `@preact/signals`设计了一个和vue的`shallowRef`几乎一样的响应式API `signal`
* `qwik`也设计了自己的状态管理API，并且提供了计算属性和异步响应式


### 运行环境

* `@orginone/runtime-web`

  * 使用`axios`和`signalr`进行网络请求
  * 使用Storage API进行持久化
  * 使用`<input>`元素和File System API进行文件交互

* `@orginone/runtime-node`

  * 由于`axios`和`signalr`库是同构(isomorphic)的，因此也可以在nodejs上运行
  * 使用nodejs的`fs`模块来进行文件读写

* `@orginone/runtime-uniapp`

  * 使用uni-app提供的`uni.request`和`uni.connectSocket`等API进行网络请求
  * 使用uni-app提供的数据缓存API和文件读写API