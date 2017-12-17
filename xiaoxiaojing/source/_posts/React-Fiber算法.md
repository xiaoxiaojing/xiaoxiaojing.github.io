---
title: React Fiber算法
date: 2017-12-16 18:08:52
tags: react
categories: REACT
---

## 1.什么是Fiber
1. 定义：是新的调度策略（Reconciler）
2. 解决的问题：React的旧的调度策略（Stack reconcile），在React的计算量很大时，会一直占用浏览器的主线程
<div style="width:600px">
{% asset_img 主线程占用情况.jpg %}
</div>

## 2.Fiber的原理
* 将原来的整个Virtual DOM的更新任务拆分成一个个小的任务。每次完成一个小任务之后，释放主线程，看看有没有优先级更高的任务。如果有的话，暂停当前任务，执行优先级更高的任务。如果没有的话，继续执行下一个小任务。
<div style="width:600px">
{% asset_img fiber执行流程.png %}
</div>

### Fiber将更新分为两个阶段
1. Reconcile阶段：依次遍历组件，通过diff算法，判断组件是否需要更新，给需要更新的组件加上tag。遍历完之后，将所有带有tag的组件加到一个数组中。这个阶段的任务可以被打断。
2. Commit阶段：根据在Reconcile阶段生成的数组，遍历更新DOM，这个阶段需要一次性执行完，不能被打断。


---
* 参考文档
 - [如何理解 React Fiber 架构？](https://www.zhihu.com/question/49496872)
 - [React的新引擎—React Fiber是什么？](http://www.infoq.com/cn/articles/what-the-new-engine-of-react)
 - [React 16 Fiber源码速览](http://zxc0328.github.io/2017/09/28/react-16-source/)
 - [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
