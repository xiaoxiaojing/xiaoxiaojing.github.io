---
title: 我理解的React
date: 2018-01-20 18:34:09
tags: react
categories: React系列
---

## React基础
React将UI也看做是数据，React工作即是将原始数据转换成UI数据。可以进一步抽象成一个纯函数：`y = f(x)`，一样的输入就有一样的输出。

## 什么是[Virtual DOM](https://reactjs.org/docs/faq-internals.html)
Virtual DOM在React中是用来表示用户界面的，它被保存在内存中。
React通过React element的相互嵌套组合可以构造一个Virtual DOM tree。
React通过Reconciliation算法将Virtual DOM转化为actual DOM。（转化的操作数是最小操作数）

## [React Components, Elements, and Instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
### Elements
React Element是一个简单的不可变的描述性对象，用于告诉React需要渲染什么。它分为DOM Element和Component Element，其中DOM Element是React中的最小单位，Component Element的type值是一个Component
React Element的相互嵌套组合可以构造一个Virtual DOM tree。当调用`ReactDOM.render`或`setState`时，React会置顶向下解析这颗树。当解析到Component Element时，会执行这样的过程`(props) => element`得到一个新的element，如此执行，直到Element是DOM Element为止。这个解析过程是调和过程（reconciliation ）的一部分。

### Instances
只有通过`ES6 class`创建的组件才有实例，通过`Function`创建的组件是没有实例的
实例的创建是React自己完成了，我们不能直接创建一个实例，但是可以在父组件中通过`ref`获取子组件的实例

## React的事件
React基于Virtual DOM实现了SyntheticEvent，它是JavaScript原生事件的一个子集。同时也实现了`stopPropagation`和`preventDefault`。
与原生事件不同的是，SyntheticEvent是跨浏览器的，使用时无需再考虑兼容性问题。
SyntheticEvent和原生事件一样都有两个阶段：捕获阶段（onClickCapture）和冒泡阶段（onClick）
对于SyntheticEvent有三个需要注意的点：
1. SyntheticEvent是共享的
2. SyntheticEvent不能通过`return false`去阻止事件的默认行为和事件冒泡
3. SyntheticEvent只能阻止React合成事件系统中的冒泡，不能阻止原生事件的冒泡。但是原生事件可以阻止SyntheticEvent的冒泡
