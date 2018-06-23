---
title: 《深入浅出Node.js》学习笔记：模块机制
date: 2018-02-13 14:24:09
tags: NodeJS
categories: NodeJS系列
---

Node借鉴CommonJS的Modules规范实现了一套非常易用的模块系统
<div style="max-width: 800px">
{% asset_img node、w3c、commonJs的关系.jpg %}
</div>

## Node的模块
Node的模块实现遵守了CommonJS规范

### 模块引入
Node引入模块需要经历三个步骤：路径分析、文件定位、编译执行
<div style="max-width: 800px">
{% asset_img 模块引入流程.png 模块引入流程 %}
</div>

### 模块缓存
Node对引入过的模块都会进行缓存，以减少二次引入的开销
Node缓存的是引入的模块编译和执行之后的对象

### 模块分类
1. 核心模块：Node提供的
  * 核心模块部分在 **Node源代码** 的编译过程中，编译进了二进制执行文件。在Node进程启动时，部分核心模块就被直接加载进 **内存** 中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在 **路径分析中优先判断**，所以它的加载速度是最快的
2. 文件模块：用户编写的
  * 文件模块则是 **在运行时动态加载**，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢

### 模块对象
在Node中，每个文件模块都是一个对象
```
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {   
    parent.children.push(this);
  }
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

### 模块编译过程
Node已有的加载方式有三种，可以通过`require.extensions`查看
```
{ '.js': [Function], '.json': [Function], '.node': [Function] }
```

在对javascript模块编译过程中，会对文件进行头尾包装，如下：
```
(function(exports, require, module, __filename, __dirname){
  var math = require('math')
  module.exports = {
    ping: 'pong'
  }
})
```

## 模块调用栈
文件模块、核心模块、C/C++内建模块和C/C++扩展模块的调用关系如下：
<div style="max-width: 800px">
{% asset_img 模块之间的调用关系.jpg %}
</div>

C/C++内建模块是最底层的模块也是核心模块，主要提供API给JavaScript核心模块和 第三方JavaScript文件模块调用

JavaScript核心模块主要扮演的职责有两类
  * 一类是作为C/C++内建模块的封装层和桥接层， 供文件模块调用
  * 一类是纯粹的功能模块，它不需要跟底层打交道，但是又十分重要
