---
title: React原理：Fiber
date: 2017-12-16 18:08:52
tags: react
categories: React系列
---

## React Fiber
> The goal of React Fiber is to increase its suitability for areas like animation, layout, and gestures. Its headline feature is incremental rendering: the ability to split rendering work into chunks and spread it out over multiple frames.

> Other key features include the ability to pause, abort, or reuse work as new updates come in; the ability to assign priority to different types of updates; and new concurrency primitives.

1. React Fiber的定义：是新的调度策略
2. React Fiber的优化目标：使动画更加流畅，页面刷新更快，能及时响应用户交互
3. React Fiber的主要特征：增量渲染
4. React Fiber的其他特征：能够暂停、重启、丢弃某个更新；能够优先处理优先级高的更新。
5. React Fiber要解决的问题：React的旧的调度策略（Stack reconcile），在React的计算量很大时，会一直占用浏览器的主线程
<div style="max-width:600px">
{% asset_img 主线程占用情况.jpg %}
</div>

## 与React Fiber相关的几个概念
|概念|说明|
|:---|:---|
|reconciliation|The algorithm React uses to diff one tree with another to determine which parts need to be changed.|
|update|A change in the data used to render a React app. Usually the result of `setState`. Eventually results in a re-render.|
|Reconciler & Renderer|**reconciler**：does the work of computing which parts of a tree have changed<br/>**renderer**：uses that information to actually update the rendered app|
|scheduling|the process of determining when work should be performed.|
|work|any computations that must be performed. Work is usually the result of an update (e.g. setState).|

### 理解React中的`reconciler`和`renderer`
**`Reconciler`**：用于计算新老View的差异，React16之前的reconciler叫`Stack reconciler`，React Fiber实现了新的Reconciler。
**`Renderer`**：负责将View的变化渲染到不同的平台上，在Web上的renderer是`ReactDOM`

## React Fiber中的fiber
### fiber的几个含义
1. 工作单元（a unit of work）：将一次渲染分解为增量操作单元（incremental units），用一个fiber来表示每个单元。
2. virtual stack frame：原本的call stack无法满足React Fiber的设计需求，React Fiber重新实现了stack，使得我们有中断stack的调用，手动控制stack frames的能力。而fiber就可以理解为一个virtual stack frame。

### fiber的数据结构
> a fiber is a JavaScript object that contains information about a component, its input, and its output.

fiber是一个对象，一个fiber上包含了React组件的相关信息，以及与这个组件关联的输入和输出。它有如下属性
```
{
  tag: TypeOfWork, // 标识Fiber的类型

  // fiber的key，type属性与React element上的key，type属性作用一样
  key: null | string, // 当Fiber的type相同时，用key来区分Fiber
  type: any, // 指向与Fiber有关的function/class/module

  // 这些属性指向其他Fiber，用于描述Fiber tree的树状结构
  child: Fiber | null,
  sibling: Fiber | null,
  return: Fiber | null, // 指向当前Fiber的父节点

  // React中props是一个函数的参数，相同的props将会得到相同的结果
  // 当一个Fiber执行时，设置pendingProps，Fiber执行完成后，设置memoizedProps
  // 如果pendingProps与memoizedProps相同，说明这个Fiber没有执行的必要
  pendingProps: any,
  memoizedProps: any,

  // 用于说明Fiber的优先级
  expirationTime: ExpirationTime,

  // 任何正在执行的Fiber都是成对的。
  // work-in-progress是一个还没有执行完的Fiber
  // current Fiber的alternate指向work-in-progress，work-in-progress的alternate指向current Fiber
  alternate: Fiber | null,

  // memoizedState被用于创建一个output
  memoizedState: any,
}
```

### fiber tree
在实际的渲染过程中，fiber节点构成一颗树。这颗树在数据结构上是通过单链表的形式构成的，fiber节点上的child和sibling属性分别指向了这个节点的第一个子节点和相邻的兄弟节点
React执行更新的时候，会根据原来的fiber节点（current）clone出一个新的fiber节点（alternate）。两个fiber节点diff出的变化（side effect）记录在alternate上。alternate fiber被称为working in progress fiber。
<div style="max-width:480px">
{% asset_img Fiber树.jpg Fiber树%}
</div>

## React Fiber的运作流程
将原来的整个Virtual DOM的更新任务拆分成一个个小的任务。每次完成一个小任务之后，释放主线程，看看有没有优先级更高的任务。如果有的话，暂停当前任务，执行优先级更高的任务。如果没有的话，继续执行下一个小任务。
<div style="max-width:600px">
{% asset_img fiber执行流程.png Fiber执行流程%}
</div>

### React Fiber的两个phase
**Reconcile阶段**：依次遍历组件，通过diff算法，判断组件是否需要更新，给需要更新的组件加上tag。遍历完之后，将所有带有tag的组件加到一个数组中。这个阶段的任务可以被打断。
**Commit阶段**：根据在Reconcile阶段生成的数组，遍历数组并调用renderer更新DOM，这个阶段需要一次性执行完，不能被打断。

## React Fiber 对现有代码的影响
原理：在React Fiber中，一次更新过程会分成多个分片完成，当一次更新过程被打断，处理更高优先级的任务后，他会重新开始更新。
会被打断的更新发生在以下函数中，所以以下函数在一次更新中可能会被多次调用
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
