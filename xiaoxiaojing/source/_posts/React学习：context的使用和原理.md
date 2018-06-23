---
title: React学习：context的使用和原理
date: 2017-12-27 14:12:53
tags: react
categories: React系列
---

## 我们为什么使用context？
* context提供了一种直接传递数据到组件树深处组件的方式，数据不需要一层一层传递下去。

## 用法
1. 改写父组件：添加`getChildContext`方法和`childContextTypes`属性
```js
class ParentComponent extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }
  render() {
    // ....
  }
}

ParentComponent.childContextTypes = {
  color: PropTypes.string
}
```

2. 改写子组件：添加`contextTypes`属性，并通过`this.context`访问属性
  - 如果没有定义`contextTypes`，`this.context`为空对象
```
ChildComponent.contextTypes = {
  color: PropTypes.string
}
```
  - 如果定义了`contextTypes`，子组件的如下生命周期函数将会接收`context`作为参数
```
constructor(props, context)
componentWillReceiveProps(nextProps, nextContext)
shouldComponentUpdate(nextProps, nextState, nextContext)
componentWillUpdate(nextProps, nextState, nextContext)
```
  - 如果定义了`contextTypes`，无状态组件也会接收`context`作为参数
```
function ChildComponent (props, context) {
  //...
}
```

## 使用context存在的问题
### context + shouldComponentUpdate/PureComponent
* `shouldComponentUpdate`的作用：当state没有改变时，控制组件以及其子组件不重新渲染
* 使用shouldComponentUpdate或者使用PureComponent时，阻止子组件选择的同时也会阻止`context`的传递

## 如何安全的使用context
### 指定一定的规则
* 规定`context`是不可变的，并且只在初始化时向下传递一次

### 使用 injection system
* 使用一个特殊的数据结构，监听state的变化，强制更新组件。参考这个库：[react-broadcast](https://github.com/ReactTraining/react-broadcast)，它使用了这种模式。
```js
// 数据结构如下
class Theme {
  constructor(color) {
    this.color = color
    this.subscriptions = [] // listeners
  }
  setColor(color) {
    this.color = color
    this.subscriptions.forEach(f => f())  // 触发listener
  }
  subscribe(f) {
    this.subscriptions.push(f) // 注册listener
  }
}

// 在父组件上只要color变化，调用setColor
class MessageBox extends React.Component {
  constructor (props, context) {
    super (props, context)
    this.theme = new Theme(this.props.color) // 实例化Theme
  }
  // 只要color有更新，就调用setColor
  componentWillReceiveProps(next) {
    this.theme.setColor(next.color)
  }
  getChildContext() {
    return {theme: this.theme};
  }
  render () {
    return <MessageList messages={this.props.messages}/>
  }
}

MessageBox.childContextTypes = {
  theme: PropTypes.object
}

// 在子组件上注册listener，并通过this.context.theme访问color
class Button extends React.Component {
  componentDidMount () {
    // 注册listener
    this.context.theme.subscribe(() => this.forceUpdate())
  }
  render() {
    return (
      <button style={{background: this.context.theme.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  theme: PropTypes.object
};
```
> 上述实现过于简单，一个合格的实现需要在`componentWillUnmount`中清除事件监听器，并且更新state应该使用`setState`而不是`forceUpdate`

## react如何实现context
### [ReactFiberContext.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberContext.js)
* isContextProvider：通过判断父组件是否定义了`childContextTypes`，来确定父组件是否是一个`contextProvider`
```js
export function isContextProvider(fiber: Fiber): boolean {
  return fiber.tag === ClassComponent && fiber.type.childContextTypes != null;
}
```
* isContextConsumer：通过判断组件是否定义了`contextTypes`，来确定组件是否是一个`contextConsumer`
```js
export function isContextConsumer(fiber: Fiber): boolean {
  return fiber.tag === ClassComponent && fiber.type.contextTypes != null;
}
```
* processChildContext：通过父组件获取子组件的context
```js
export function processChildContext(
  fiber: Fiber,
  parentContext: Object,
): Object {
  const instance = fiber.stateNode;
  const childContextTypes = fiber.type.childContextTypes;
  // 声明子组件的context变量
  let childContext;
  startPhaseTimer(fiber, 'getChildContext');
  // 通过getChildContext获取对象赋给childContext
  childContext = instance.getChildContext();
  stopPhaseTimer();
  // 判断getChildContext中定义的对象，是否有在childContextTypes中声明
  for (let contextKey in childContext) {
    invariant(
      contextKey in childContextTypes,
      '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
      getComponentName(fiber) || 'Unknown',
      contextKey,
    );
  }
  return {...parentContext, ...childContext};
}
```
* getMaskedContext：在子组件上获取context
```js
export function getMaskedContext(
  workInProgress: Fiber,
  unmaskedContext: Object,
) {
  const type = workInProgress.type;
  // 子组件必须定义contextTypes，否则会返回一个空对象
  const contextTypes = type.contextTypes;
  if (!contextTypes) {
    return emptyObject;
  }
  // 当context没有变化时，从备份中获取context
  const instance = workInProgress.stateNode;
  if (
    instance &&
    instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext
  ) {
    return instance.__reactInternalMemoizedMaskedChildContext;
  }
  // 创建context
  const context = {};
  for (let key in contextTypes) {
    context[key] = unmaskedContext[key];
  }
  // 备份context
  if (instance) {
    cacheContext(workInProgress, unmaskedContext, context);
  }
  return context;
}
```

### [ReactFiberReconciler.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberReconciler.js)
* 更新的时候，子组件会重新获取它的context
```js
updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): void {
  // ...
  // 获取子组件的context
  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  // ...
}
```
* 根据父组件获取子组件的context
```js
function getContextForSubtree(
  parentComponent: ?React$Component<any, any>,
): Object {
  // 如果没有父组件，context为emptyObject
  if (!parentComponent) {
    return emptyObject;
  }
  const fiber = ReactInstanceMap.get(parentComponent);
  const parentContext = findCurrentUnmaskedContext(fiber);
  return isContextProvider(fiber)
    ? processChildContext(fiber, parentContext)
    : parentContext;
}
```

### [ReactFiberBeginWork.js](https://github.com/facebook/react/blob/b77b12311f0c66aad9b50f805c53dcc05d2ea75c/packages/react-reconciler/src/ReactFiberBeginWork.js)
* 子组件更新context在这个进行

* 待续。。。

---
* 参考链接
  - [官方文档：Context](https://discountry.github.io/react/docs/context.html)
  - [How to safely use React context](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)
  - [react中context到底是如何传递的-源码分析](https://segmentfault.com/a/1190000012022827)
