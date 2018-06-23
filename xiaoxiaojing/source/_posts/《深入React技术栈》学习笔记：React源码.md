---
title: 《深入React技术栈》学习笔记：React源码
date: 2017-11-11 11:49:33
tags: react
categories: React系列
---

* 源码版本：React 16.2.0

## React项目总览
* [项目地址]（https://github.com/facebook/react/tree/v16.2.0）
* 使用的构建工具：{% post_link yarn概览 yarn概览 %}

## react源码解读
* 先了解几个常量：[ReactSymbols.js](https://github.com/facebook/react/blob/v16.2.0/packages/shared/ReactSymbols.js)
```
REACT_ELEMENT_TYPE   //Symbol('react.element')
REACT_FRAGMENT_TYPE  //Symbol('react.fragment')
REACT_CALL_TYPE      //Symbol('react.call')
REACT_RETURN_TYPE    //Symbol('react.return')
REACT_PORTAL_TYPE    //Symbol('react.portal')
```

### 1.[入口文件](https://github.com/facebook/react/blob/v16.2.0/packages/react/index.js)
```
var React = require('./src/React');
// 暴露了React实例，使用React.default方便测试
module.exports = React.default ? React.default : React;
```

### 2.[React.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/React.js)
```
// 这个文件是定义一个有各类方法和属性的React对象，从源码中可以看出React有以下属性和方法
{
  Children,
  Component,
  PureComponent,
  unstable_AsyncComponent,
  Fragment,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  version,
}
```

### 3.[ReactNoopUpdateQueue.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/ReactNoopUpdateQueue.js)
```
// 声明了几个空函数，从这里的命名可以看出React是通过队列来做更新操作的
var ReactNoopUpdateQueue = {
  isMounted: function(publicInstance) {
    return false;
  },
  // 强制更新
  // 调用这个方法时，不会调用`shouldComponentUpdate`，但是会调用`componentWillUpdate`和`componentDidUpdate`
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
  },
  // 调用这个方法去修改state，但是不能保证`this.state`马上被更新
  // 调用这个方法后，去获取`this.state`，可能会得到旧的值
  enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
  },
  enqueueSetState: function(publicInstance, partialState, callback, callerName) {
  }
}
```

### 4.[ReactBaseClasses.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/ReactBaseClasses.js)
* 1）返回用于构造组件的几个基类：Component，PureComponent，AsyncComponent
  - 构造Component
```
// 定义Component，有私有的props，context，refs，updater属性
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
// this.state是不可变的，只能通过this.setState来更新
// 使用this.setState更新state是批量更新
// 所以调用this.setState后不会马上更新this.state，调用方法后马上访问this.state可能会得到旧的state
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```
  - 构造`PureComponent`(`AsyncComponent`的构造和`PureComponent`同理)，继承关系如图所示
```
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

<div style="max-width:680px">
{% asset_img 继承关系.jpg %}
</div>

    * 本质上采用了 {% post_link 面向对象的程序设计之继承 寄生组合式继承  %} （通过构造函数继承属性，通过寄生式继承来继承方法）
    * ComponentDummy：是一个中间类，它的prototype指向Component的原型对象
    * ComponentDummy实例：通过new关键字创建，它的[[prototype]]指向Component的原型对象
    * 扩展ComponentDummy实例：使其`constructor`指向`PureComponent`，并将`Component.prototype`上的属性赋给它（由于`Component.prototyp`的`constructor`属性是不可枚举的，所以不会覆盖之前的属性），并添加了`isPureReactComponent`属性
    * 这样继承后的结果：当访问`setState`方法，会先看`PureComponent`的原型对象上是否有该方法，再去看`Component`的原型对象上是否有该方法。也就是说，当`Component`的原型对象发生改变时，不会影响到PureComponent；且这样继承后，声明的PureComponent实例的属性是通过PureComponent的构造函数构造的，而不是通过Component的构造函数。（总得来说这样继承拷贝了Component.prototype上的方法到PureComponent.prototype上，在之后对原型对象的操作时，将会互不影响。）

* 2）源码中对`setState`的解释
  - `this.state`应该被认为是不可变的，只能通过`this.setState`来更新
  - 由于使用`this.setState`更新`state`是批量更新，所以调用`this.setState`不会马上更新`this.state`，调用方法后马上访问`this.state`将会得到旧的state

### 5.[ReactChildren.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/ReactChildren.js)
* 几个功能函数
```
getPooledTraverseContext(map, key, func, context) // 汇总上下文
releaseTraverseContext(traverseContext) // 释放（release）上下文，将各个引用设为null
```

* `forEach`、`map`、`count`、`toArray`都调用了同一个函数：`traverseAllChildrenImpl`  
  - 如果Children为：`undefined`, `boolean`, `string`, `object`（且`$$typeof`为特定值）， 执行callback，并返回1
  - 如果Children为Array：**循环数组** 计算节点数量，**递归** 调用callback
```
for (var i = 0; i < children.length; i++) {
  child = children[i];
  nextName = nextNamePrefix + getComponentKey(child, i);
  subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext); // 递归时，invokeCallback为真，会调用callback，并返回1
}
```
  - 如果Children为Iterator(即可迭代对象)：**迭代对象** 计算节点数量，**递归** 调用callback

* `React.Children.only`：判断是否只有一个Children
```
function onlyChild(children) {
  invariant(
    isValidElement(children), // 当chidlren.$$typeof为REACT_ELEMENT_TYPE才会为真
    'React.Children.only expected to receive a single React element child.',
  );
  return children;
}
```

### 6.[ReactElement.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/ReactElement.js)
* 使用【工厂模式】创建`ReactElement`对象
```
const ReactElement = function () {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  }
  return element
}
```
* 提供了一系列方法：`createElement`、`createFactory`、`cloneAndReplaceKey`、`cloneElement`、isValidElement
