---
title: React原理：Fiber
date: 2017-12-16 18:08:52
tags: react
categories: REACT
---

## 什么是Fiber
1. 定义：是新的调度策略（Reconciler）
2. 解决的问题：React的旧的调度策略（Stack reconcile），在React的计算量很大时，会一直占用浏览器的主线程
<div style="max-width:600px">
{% asset_img 主线程占用情况.jpg %}
</div>

## Fiber的原理
将原来的整个Virtual DOM的更新任务拆分成一个个小的任务。每次完成一个小任务之后，释放主线程，看看有没有优先级更高的任务。如果有的话，暂停当前任务，执行优先级更高的任务。如果没有的话，继续执行下一个小任务。
<div style="max-width:600px">
{% asset_img fiber执行流程.png %}
</div>

### 理解React中的`reconciler`和`renderer`
1. `Reconciler`：用于计算新老View的差异，React16之前的reconciler叫`Stack reconciler`，Fiber是新的Reconciler
2. `Renderer`：负责将View的变化渲染到不同的平台上，在Web上的renderer是`ReactDOM`

### 理解Fiber Reconciler的两个phase
1. Reconcile阶段：依次遍历组件，通过diff算法，判断组件是否需要更新，给需要更新的组件加上tag。遍历完之后，将所有带有tag的组件加到一个数组中。这个阶段的任务可以被打断。
2. Commit阶段：根据在Reconcile阶段生成的数组，遍历更新DOM，这个阶段需要一次性执行完，不能被打断。

### Fiber树
* 在实际的渲染过程中，Fiber节点构成一颗树。这颗树在数据结构上是通过单链表的形式构成的，Fiber节点上的child和sibling属性分别指向了这个节点的第一个子节点和相邻的兄弟节点
<div style="max-width:480px">
{% asset_img Fiber树.jpg %}
</div>

* Fiber在update的时候，会从原来的Fiber（current）clone出一个新的Fiber（alternate）。两个Fiber树diff出的变化（side effect）记录在alternate上。alternate fiber被称为working in progress fiber。

## React Fiber 对现有代码的影响
1. 原理：在React Fiber中，一次更新过程会分成多个分片完成，当一次更新过程被打断，处理更高优先级的任务后，他会重新开始更新。
2. 会被打断的更新发生在以下函数中，所以以下函数在一次更新中可能会被多次调用
  - componentWillMount
  - componentWillReceiveProps
  - shouldComponentUpdate
  - componentWillUpdate

---
* 参考文档
 - [如何理解 React Fiber 架构？](https://www.zhihu.com/question/49496872)
 - [React的新引擎—React Fiber是什么？](http://www.infoq.com/cn/articles/what-the-new-engine-of-react)
 - [React 16 Fiber源码速览](http://zxc0328.github.io/2017/09/28/react-16-source/)
 - [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
