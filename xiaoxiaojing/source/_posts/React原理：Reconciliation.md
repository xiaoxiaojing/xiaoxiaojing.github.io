---
title: React原理：Reconciliation
date: 2018-01-21 22:34:26
tags: react
categories: React系列
---

## Reconciliation
> Reconciliation: The algorithm React uses to diff one tree with another to determine which parts need to be changed

定义：
调和（`reconciliation`）是一个算法，解决将`Virtual DOM tree`转换为`actual DOM tree`的最少操作次数的问题

两个假设：
  - 如果两个element的type不一样，它们生成的树也不一样
  - 会为一个列表中的每个element添加key

## Diffing 算法
React比较两颗Virtual DOM tree是置顶向下进行比较的。从root element开始，向下递归处理其子节点，当满足某些条件时返回。

这些条件有：
- 该节点没有子节点；
- 该节点被判断为应该被删除；
- 该节点的`shouldComponentUpdate`返回false；

代码示例：[https://jsfiddle.net/erL18dyy/2/](https://jsfiddle.net/erL18dyy/2/)

### 比较两个type不同的element
如果element的type不同，React只会进行 **创建** 和 **删除** 操作。

删除旧的节点及其子节点，创建新的节点及其子节点。(反应到真实DOM上就是该节点及其子节点被整个替换了)
如果被删除的节点是Component Element，其会调用`componentWillUnmount`。由于旧节点被删除了，与它关联的state将丢失，当它被再次新建时，state会被重新初始化。
如果新创建的节点是Component Element，其会调用`constructor`、`componentWillMount`和`componentDidMount`。

### 比较两个type相同的DOM element
如果两个DOM element的type相同，将比较它们的属性，比较完之后递归其子节点。React只会更新 **有修改的属性**。

React只会更新有更改的属性，如下：只会更新className
```
<div className="before" title="stuff" />
<div className="after" title="stuff" />
```
当属性值是对象时，也只会更新该对象中有修改的属性，如下：只会更新color
```
<div style={{color: 'red', fontWeight: 'bold'}} />
<div style={{color: 'green', fontWeight: 'bold'}} />
```

### 比较两个type相同的Component element
当element是Component element，不会直接比较Component element，而是通过Component创建新的element。然后进入下一轮比较。

回顾一下Component Element的基本结构。两个Component element的type相同，说明两个Component的实例相同。
```
{
  type: Button,
  props: {
    color: 'red'
  }
}
```
当props有变化，Component（也就是Button）根据新的props，依次调用`componentWillReceiveProps`和`componentWillUpdate`、`render`获取新的element，然后与旧的element进行下一轮比较。

### DOM节点有多个子节点
React会同时迭代新旧两个子节点列表，通过key属性来匹配新旧两个子节点列表中的节点

---
参考链接：
* [Reconciliation](https://reactjs.org/docs/reconciliation.html)
