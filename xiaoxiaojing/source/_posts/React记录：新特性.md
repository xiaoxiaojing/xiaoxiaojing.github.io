---
title: React记录：新特性
date: 2018-01-18 11:49:33
tags: react
categories: React系列
---

# React v16.2.0
## `React.Fragment`
可以使用`React.Fragment`来包裹多个React Element。渲染后不会创建多余的DOM
```
const Fragment = React.Fragment
render() {
  return (
    <Fragment>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </Fragment>
  );
}
```

`React.Fragment`有且仅有一个属性`key`
```
props.items.map(item => (
   // Without the `key`, React will fire a key warning
   <Fragment key={item.id}>
     <dt>{item.term}</dt>
     <dd>{item.description}</dd>
   </Fragment>
 ))
```

JSX也实现了对应的功能，但是不能设置`key`属性
```
// <>：表示Fragments
render () {
  return (
    <>
      <ChildA />
      <ChildB />
    <>
  )
}
```

# React v16.0
## 支持新的返回类型：fragments 和 strings
在render()方法中，return的值可以是一个数组。但是每个React Element都必须添加属性key。
```
render() {
  return [
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

在render()方法中，return的值也可以是一个string
```
render() {
  return 'Look ma, no spans!';
}
```

## 使用`error boundaries`处理错误
定义：定义了周期函数`componentDidCatch`的组件就是一个`error boundaries`
特点：`error boundaries`在发生错误的时候，能捕获错误，并在它的subtree上渲染出`fallback UI`
需要主要的地方：
- Only class components can be error boundaries；
- 可以定义一个`error boundaries`，并重复使用
- `error boundaries`只会捕获他子树的 **生命周期函数** 产生的错误
一个例子
```
// 定义了componentDidCatch的就是一个`error boundaries`
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 如果子组件发生错误，这个错误会被这个函数捕获
  // 可以通过控制ErrorBoundary的state来渲染错误信息
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// ErrorBoundary会捕获MyWidget的错误
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

## Portals([代码示例](https://github.com/xiaoxiaojing/xiaoxiaojing.github.io/tree/hexo/example/react-stack/src/demo-new-feature/Modal))
将子组件渲染到父组件以外的DOM上（以前需要通过`unstable_renderSubtreeIntoContainer`来实现）
语法：
```
ReactDOM.createPortal(child, container)
```
用法：
```
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode,
  );
}
```
优点：虽然子组件被渲染到父组件以外的DOM上，但是子组件上面的事件可以冒泡到父组件上
- 使用`unstable_renderSubtreeIntoContainer`，子组件上的事件不会冒泡到父组件上

## 支持自定义属性
```
// Your code:
<div mycustomattribute="something" />

// React 15 output:
<div />

// React 16 output:
<div mycustomattribute="something" />
```

## 文件大小更小
* react：20.7kb → 5.3kb
* react-dom：141kb → 103.7kb

## 新的核心架构：Fiber
* Async rendering：使得应用程序相应更快
