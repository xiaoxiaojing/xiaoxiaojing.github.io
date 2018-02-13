---
title: 《深入浅出Node.js》学习笔记：模块机制
date: 2018-02-13 14:24:09
tags: NodeJS
categories: NodeJS
---

## 模块规范
Node与浏览器以及W3C组织、CommonJS组织、ECMAScript之间的关系
<div style="max-width: 800px">
{% asset_img node、w3c、commonJs的关系.jpg %}
</div>

### 前后端JavaScript的区别
* 浏览器端的JavaScript：需要从一个服务器端分发到多个客户端去执行，需要通过网络加载代码（瓶颈是**带宽**）。
* 服务器端的JavaScript：相同的代码需要多次执行，需要从磁盘中加载代码（瓶颈是**CPU和内存等资源**）

### CommonJS模块规范
1. 模块引用：使用`require()`方法，引入一个模块的API
2. 模块定义
  * 每个模块中都存在`module`对象，代表模块自身。`exports`是`module`的属性；
  * 使用`exports`导出当前模块中的方法或变量
3. 模块标识
  * 模块标识就是传递给`require()`方法的参数，它必须是符合小驼峰命名的字符串，或者以`.`、`..`开头的相对路径，或者绝对路径。它可以没有文件名后缀`.js`

### AMD
> [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)
The Asynchronous Module Definition (AMD) API specifies a mechanism for defining modules such that the module and its dependencies can be asynchronously loaded. This is particularly well suited for the browser environment where synchronous loading of modules incurs performance, usability, debugging, and cross-domain access problems.

AMD（Asynchronous Module Definition）规范是CommonJS的一个延伸。
AMD规范中，依赖是异步加载的。因为在浏览器中，是通过网络加载代码的，使用异步加载可以充分利用带宽，提高性能。

1. 模块定义：（）
```
define(id?, dependencies?, factory)
```

### CMD

## Node的模块实现
## 核心模块
## C/C++扩展模块
## 模块调用栈
## 包与NPM
