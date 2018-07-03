---
title: React API：Context
date: 2018-06-23 17:29:07
tags: react
categories: React系列
---

# React新的Context
## When to use
使用Context可以在不同层级的多个组件中共享变量

## API
### React.createContext
```
const {Provider, Consumer} = React.createContext(defaultValue)
```

### Provider
```
<Provider value={/* some value */}>
```

### Consumer
```
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```
 
 ## Context API的使用技巧
 1. context的值可以是函数
 2. 定义多个context，可以使Consumer重绘更快
 3. 对于常用的context，使用HOC封装
 4. Refs不会自动传递给包装元素，需要通过`React.forwardRef`来获取ref
 
## Context API的使用注意点
context是通过判断context的引用是否相同来确定子组件是否需要重新渲染的。所以一下代码会使得Provider的子组件Consumer每次都重新渲染。
```
class App extends React.Component {
  render() {
    return (
      <Provider value={{something: 'something'}}>
        <Toolbar />
      </Provider>
    );
  }
}
```

解决方案：将value值提升到作为作为父组件的state
```
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```
