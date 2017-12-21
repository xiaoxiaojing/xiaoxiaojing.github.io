---
title: React学习：PureComponent的使用
date: 2017-11-06 19:13:11
tags: React
categories: REACT
---
## 原理
* 在React的生命周期方法`shouldComponentUpdate`中，将当前传入的`props`和`state`与之前的作**浅比较**，如果返回false，那么组件就不会执行render方法

## 源码分析
1. 定义`PureComponent`：[ReactBaseClassed.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactBaseClasses.js)
  * 在源码中，定义了PureComponent。最后定义了一个属性`isPureReactComponent`用于判断这个组件是不是`PureComponent`，便于做后续的组件更新等操作。
    ```
    function PureComponent(props, context, updater) {
      //...
    }
    //...
    pureComponentPrototype.isPureReactComponent = true;
    ```

2. 检查是否需要更新组件，[ReactFiberClassComponent.js](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberClassComponent.js)
  ```
  function checkShouldComponentUpdate() {
    // ...
    // 检查该组件是否定义了shouldComponentUpdate方法，如果已经定义，就使用该组件的shouldComponentUpdate方法进行判断
    if (typeof instance.shouldComponentUpdate === 'function') {
      // ...
      return shouldUpdate;
    }
    // 使用isPureReactComponent属性进行判断是否是PureComponent
    if (type.prototype && type.prototype.isPureReactComponent) {
      return (
        !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
      );
    }
    return true;
  ```
3. `shallowEqual`函数，[shallowEqual.js](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js)
  * 在上一个源码中我们看到，比较的时候用到了`shallowEqual`这个函数，这个函数进行的是**浅比较**。
  * 如果两个值是对象，其比较顺序为：比较两个对象引用是否相等 -> 比较两个对象的属性数量是否相等 -> 比较两个对象的第一层属性的值是否相等
  ```
  function shallowEqual(objA: mixed, objB: mixed): boolean {
    // 判断相等：基本变量直接比较值，对象、数组比较的是其引用
    if (is(objA, objB)) {
      return true;
    }
    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
      return false;
    }
    // 获取对象的属性个数
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    // 比较两个对象的属性数量是否相等
    if (keysA.length !== keysB.length) {
      return false;
    }
    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
      if (
        !hasOwnProperty.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])
      ) {
        return false;
      }
    }
    return true;
  }
  ```

## PureComponent使用误区
### 使用PureComponent后，传入的props的值更新，组件却没有更新
1. `props`的值是对象或数组
  * 如果对象或数组的引用一直没有改变，即使对象的值变了，组件也不会更新
  ```
  // items对象的引用没有改变，只是更新了其属性值，在判断对象引用是否相等时就会返回true
  <Item items={this.props.items.filter(item => item.val > 30)}/>
  ```
### 使用PureComponent后，传入的props值未更新，组件却更新了
1. `props`的值是对象字面量或数组字面量
  * 每次调用React组件都会重新创建该组件，这时对象的值没有改变，但是对象的引用地址发生了改变。导致`shallowEqual`函数结果一直为`true`，进而导致`PureComponent`组件一直更新。
  ```
  // Account是一个PureComponent，以下面方式设置style，每次渲染时style都是新对象，从而导致Account组件在每次渲染的时候都会更新
  <Account style={{color: 'black'}}/>  //对象的引用变了
  <Account style={this.props.style || {}}/> //默认值{}的引用变了，当this.props.style不存在时，Account组件会一直刷新
  // 正确的写法如下
  // 修改：在组件外定义常量
  const defaultValue = {}
  // 这样使用时传入的props的引用就不会改变
  <Account style={this.props.style || defaultValue}/>
  ```

2. `props`的值是函数，且值是**匿名函数**或者**直接使用bind绑定上下文**
  ```
  // 因为每次调用组件MyInput时，都会重新创建组件
  // 这种写法：onChange的值的引用会改变，因为它是匿名函数
  < MyInput onChange={e => this.props.update(e.target.value)} />
  //这种写法：bind()函数会创建一个新的函数（称为绑定函数），所以函数的引用会改变
  render() {
    return < MyInput onChange={this.update.bind(this)} />
  }
  // 合适的写法1：在constructor中绑定上下文
  constructor () {
    this.update = this.update.bind(this)
  }
  render() {
    return < MyInput onChange={this.update} />
  }
  // 合适的写法2：使用箭头函数
  update = () => {}
  render() {
    return < MyInput onChange={this.update} />
  }
  ```

3. 给`PureComponent`设置子组件
  ```
  // Item是一个PureComponent，如果父组件更新，这个Item始终会被重新渲染
  <Item>
    <span>text</span>
  </Item>
  // 原因：上诉代码编译后会变成， 可以看到React.createElement每次都会返回新的React对象。所以Item总是会被重新渲染
  <Item
    children={React.createElement('span', {}, 'text')}
  />
  // 解决方法：将给Item包裹一层父组件，并将父组件设置为PureComponent
  ```

---
* 参考链接
  - [React PureComponent 使用指南](https://juejin.im/entry/5934c9bc570c35005b556e1a)
  - [React Tips (1) - PureComponent 的误区](https://zhuanlan.zhihu.com/p/29011117)
  - [详解js中call apply bind](http://www.jianshu.com/p/25202260a8f5)
