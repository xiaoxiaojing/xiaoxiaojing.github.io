---
title: JS基础：模块化
date: 2018-02-26 15:47:18
tags: javascript
categories: javascript
---

## JS为什么需要模块化
JS最初通过script加载文件，这时将一个文件看做一个模块，将需要暴露的变量和方法设置到`window`对象上

使用script加载文件存在的以下问题：
1. 命令冲突：污染全局作用域
2. 依赖管理：开发人员必须主观解决模块和代码库的依赖关系
3. 文件加载：文件只能按照script标签的书写顺序进行加载
4. 代码库混乱：在大型项目中各种资源难以管理，长期积累的问题导致代码库混乱不堪

## CommonJS、AMD、CMD
前后端JavaScript的区别
* 浏览器端的JavaScript：需要从一个服务器端分发到多个客户端去执行，需要通过网络加载代码（瓶颈：**带宽**）。
* 服务器端的JavaScript：相同的代码需要多次执行，需要从磁盘中加载代码（瓶颈：**CPU和内存等资源**）

### [CommonJS规范](http://wiki.commonjs.org/wiki/Modules/1.1.1#Module_Identifiers)
CommonJS对模块的定义主要分为以下三部分：
1. 模块引用：使用`require()`方法，引入一个模块的API
2. 模块定义
  * 每个模块中都存在`module`对象，代表模块自身。`exports`是`module`的属性；
  * 使用`exports`导出当前模块中的方法或变量
3. 模块标识
  * 模块标识就是传递给`require()`方法的参数，它必须是符合小驼峰命名的字符串，或者以`.`、`..`开头的相对路径，或者绝对路径。它可以没有文件名后缀`.js`

### [AMD规范](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)
AMD（Asynchronous Module Definition）规范是CommonJS的一个延伸。

AMD规范中，依赖是异步加载，提前加载的
* AMD规范中，依赖是异步加载的。因为在浏览器中，是通过网络加载代码的，使用异步加载可以充分利用带宽，提高性能。
* AMD规范中，由于依赖是异步加载的，所以一个模块必须等到他的所有依赖加载完毕才能开始执行。

AMD规范中，需要通过`define()`来显示定义一个模块，通过`return`来实现导出
```
define(id?, dependencies?, factory)

// factory
function () {
  const exports = {}
  exports.sayHello = function () {}
  return exports
}
```

### [CMD规范](https://github.com/cmdjs/specification/blob/master/draft/module.md)
CMD（Common Module Definition）规范与CommonJS规范定义保持一致
CMD规范中，依赖可以动态引入，依赖是按需加载的

CMD规范中，需要通过`define()`来显示定义一个模块
```
define(factory)

// factory
function(require, exports, module) {
  exports.sayHello = function () {}
}
```

## 总结
CommonJS定义模块定义和依赖引入的规范。但是由于浏览器环境限制，同步加载影响性能，所以前端采用AMD和CMD规范。
AMD规范主要特点是：依赖是异步加载，提前加载的
CMD规范主要特点是：依赖可以动态引入，依赖是按需加载的

---
参考链接：
* [理解JS模块化](http://www.bijishequ.com/detail/326103)
* [前端模块化进程，commonJS，AMD，CMD对比](https://segmentfault.com/a/1190000010914834)
* [前端模块化](http://www.cnblogs.com/dolphinX/p/4381855.html)
