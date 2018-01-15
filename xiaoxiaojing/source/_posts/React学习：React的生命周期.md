---
title: React学习：React的生命周期
date: 2018-01-13 14:24:44
tags: react
categories: REACT
---

## 关于创建组件的一段历史
【早期】创建一个组件有三种方法：通过 **`React.createClass`、`ES6 class`、`Function`**。
【现在】随着`React v16.0`的发布，`React`中`React.createClass`这个方法的实现被移除，facebook提供一个单独的包：[`create-react-class`](https://yarnpkg.com/en/package/create-react-class)，用于实现`React.createClass`的功能。

### `React.createClass`
【两个方法】使用`React.createClass`方法创建组件需要设置两个方法：`getInitialState`（初始化state）、`getDefaultProps`（提供默认的props）
【需要注意】`getDefaultProps`只会在组件创建的时候调用一次，`getInitialState`会在组件每次装载的时候调用
【一个🌰】在这个例子中我们给父子组件分别定义了`getDefaultProps`和`getInitialState`，由于父组件中加载了两个子组件，所以子组件的`getInitialState`调用了两次，但是`getDefaultProps`只调用了一次。
```
const React = require('react')
const createReactClass = require('create-react-class')

const ChildComponent = createReactClass({
  getDefaultProps () {
    console.log('create child props')
    return {}
  },

  getInitialState () {
    console.log('init child state')
    return {}
  },

  render () {
    return (
      <div>
        this is a child component which create by createClass
      </div>
    )
  }
})

const ParentComponent = createReactClass({
  getDefaultProps () {
    console.log('create parent props')
    return {}
  },

  getInitialState () {
    console.log('init parent state')
    return {}
  },

  render () {
    return (
      <div>
        this is a parent component which create by createClass
        <ChildComponent />
        <ChildComponent />
      </div>
    )
  }
})

export default ParentComponent
```
【程序运行结果】如下所示，`getDefaultProps`只会在组件创建的时候调用一次，`getInitialState`会在组件每次装载的时候调用一次。父组件中包含了两个子组件，所以`init child state`打印了两次。
```
create child props
create parent props
init parent state
init child state
init child state
```
在上面的🌰中，我们定义了`getDefaultProps`和`getInitialState`，它们对于组件来说都是生命周期函数。下面具体说明一下组件的生命周期函数。

## 组件的生命周期
生命周期（life-cycle）是相对于组件（component）来说的，每个组件都会经历一个从装载（Mount）到卸载（Unmount）的过程。
以下讨论的生命周期都是针对于通过`ES6 class`创建的组件来分析的，这些通过`ES6 class`创建的组件会被添加tag（tag值为：`ClassComponent`）。这类组件有以下生命周期函数
```
constructor(props)
componentWillMount()
componentDidMount()
componentWillReceiveProps(nextProps, nextState, newContext)
shouldComponentUpdate(prevProps, prevState)
componentWillUpdate(newProps, newState, newContext)
componentDidUpdate(prevProps, prevState)
componentWillUnmount()
render()
```
他们的执行情况如下图所示
<div style="max-width:600px;">
{% asset_img react_lifecycle_1.png %}
</div>

## Unmount阶段
在组件卸载阶段，这个阶段会调用`componentWillUnmount`。
会导致组件卸载的情况：组件被删除。

### 源码分析
当组件卸载的时候，对于`ES6 class`创建的组件，会执行tag为`ClassComponent`的对应系列程序，最终会调用`callComponentWillUnmountWithTimer`这个方法，进而调用`componentWillUnmount`方法。（[ReactFiberCommitWork.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberCommitWork.js)）
```
var callComponentWillUnmountWithTimer = function(current, instance) {
  startPhaseTimer(current, 'componentWillUnmount');
  instance.props = current.memoizedProps;
  instance.state = current.memoizedState;
  instance.componentWillUnmount(); // 调用componentWillUnmount
  stopPhaseTimer();
}
```

### 实例说明
如下所示，点击button后子组件会被删除，在移除之前会调用`componentWillUnmount`（除此之外，不会再调用其他生命周期函数），输出`component will unmount`。
```
import React, {Component} from 'react'

export default class MountTest extends Component {
  constructor (props, context) {
    super(props)
    this.state = {show: true}
  }

  componentWillUnmount () {
    console.log('component did unmount')
  }

  handler = () => {
    this.setState({show: false})
  }

  render () {
    return (
      <div>
        {this.state.show && <ChildComponent />}
        test the unmount process, this is a parent
        <button onClick={this.handler}>remove</button>
      </div>
    )
  }
}

class ChildComponent extends Component {
  constructor (props, context) {
    super(props)
  }

  componentWillUnmount () {
    console.log('component will unmount')
  }

  render () {
    return (
      <div>
        the child component will be remove
      </div>
    )
  }
}
```

## Mount阶段
这个阶段会依次调用`constructor`、`componentWillMount`、`render`、`componentDidMount`。
其中`constructor`、`componentWillMount`、`componentDidMount`有且只会被调用一次。

React会先判断组件有没有装载，如果没有就执行装载的流程，如果有装载就执行更新的流程。（[ReactFiberBeginWork.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberBeginWork.js)）
```
function updateClassComponent (current, workInProgress, renderExpirationTime) {
  let shouldUpdate
  if (current == null) { // 如果当前节点不存在，就进行初始化操作
    if (!workInProgress.stateNode) {
        // In the initial pass we might need to construct the instance.
        constructClassInstance(workInProgress, workInProgress.pendingProps);
        mountClassInstance(workInProgress, renderExpirationTime);
        shouldUpdate = true;
      }
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
  }
}
```

### constructor(props, context)
在`constructor`可以初始化`state`。执行`this.state={...}`，相当于调用`getInitialState`方法。

`workInProgress.type`其指向当前正在被装载的组件，执行`new ctor(props, context)`时，会调用组件的生命周期函数`constructor`。（[ReactFiberClassComponent.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberClassComponent.js)）
```
function constructClassInstance(workInProgress: Fiber, props: any): any {
  const ctor = workInProgress.type; // 获取组件
  const unmaskedContext = getUnmaskedContext(workInProgress);
  const needsContext = isContextConsumer(workInProgress);
  const context = needsContext ? getMaskedContext(workInProgress, unmaskedContext): emptyObject;
  const instance = new ctor(props, context); // 创建组件实例
  // ...
  return instance;
}
```

### componentWillMount()
在这个生命周期函数中可以执行`this.setState`更新state，使得后续访问的state为更新后的state。并且调用`this.setState`不会触发二次更新。

在`mountClassInstance`方法中有一句注释：`If we had additional state updates during this life-cycle, let's process them now`。当state有变化时，会调用`updater.enqueueReplaceState`将更新加入到更新队列中，如果`updateQueue`有值，就会调用`processUpdateQueue`方法，执行更新操作。 （[ReactFiberClassComponent.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberClassComponent.js)）
```
function mountClassInstance () {
  // ...
  if (typeof instance.componentWillMount === 'function') {
    callComponentWillMount(workInProgress, instance);
    // If we had additional state updates during this life-cycle, let's process them now.
    const updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
      instance.state = processUpdateQueue(current, workInProgress, updateQueue, instance, props, renderExpirationTime);
    }
  }
  // ...
}
function callComponentWillMount(workInProgress, instance) {
    startPhaseTimer(workInProgress, 'componentWillMount');
    const oldState = instance.state;
    instance.componentWillMount();
    stopPhaseTimer();
    if (oldState !== instance.state) {
      // 会将更新加入更新队列
      updater.enqueueReplaceState(instance, instance.state, null);
    }
}
```

### componentDidMount()
在`mountClassInstance`方法中，也有`componentDidMount`的对应逻辑。在这里只是将`effectTag`的值设置为`Update`。 （[ReactFiberClassComponent.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberClassComponent.js)）
```
function mountClassInstance () {
  // ...
  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update;
  }
}
```
在Fiber执行Commit时，会执行`commitLifeCycles`，如果该组件的`effetctTag`为`Update`，就会执行生命周期函数`componentDidMount`或`componentDidUpdate`。逻辑为：如果当前组件第一次Mount，那么执行`componentDidMount`，如果已经装载过，则执行`componentDidUpdate`。([ReactFiberCommitWork](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberCommitWork.js))
```
function commitLifeCycles(current: Fiber | null, finishedWork: Fiber): void {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const instance = finishedWork.stateNode;
      // 这里做 & 运算，是一个位运算，用于判断是否是更新操作
      if (finishedWork.effectTag & Update) {  
        if (current === null) { // 组件第一次装载
          startPhaseTimer(finishedWork, 'componentDidMount');
          instance.props = finishedWork.memoizedProps;
          instance.state = finishedWork.memoizedState;
          instance.componentDidMount();
          stopPhaseTimer();
        } else {
          // ...
        }
      }
      const updateQueue = finishedWork.updateQueue;
      if (updateQueue !== null) {
        commitCallbacks(updateQueue, instance);
      }
      return;
    }
        // ...
  }
}
```

## Update阶段
这个阶段会依次调用`componentWillReceiveProps`、`shouldComponentUpdate`、`componentWillUpdate`、`render`、`componentDidUpdate`。
只有当props有变化时，才会调用`componentWillReceiveProps`。
如果`shouldComponentUpdate`返回false，`componentWillUpdate`、`render`、`componentDidUpdate`不会再执行。

在Mount阶段的源码分析有提到：React会先判断组件有没有装载，如果没有就执行装载的流程，如果有装载就执行更新的流程。所以执行更新流程时，会执行`updateClassInstance`方法，这个方法中定义了如何执行`componentWillReceiveProps`，`componentWillUpdate`。（[ReactFiberClassComponent.js](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiberClassComponent.js)）

### componentWillReceiveProps(newProps, newContext)
**同`componentWillMount`一样，在`componentWillReceiveProps`，也给予了用户一次修改state的机会，同样在这个方法里调用`setState`是不会触发二次更新的。**

在`updateClassInstance`方法中有这样一段代码。很简单的逻辑，就是当`componentWillReceiveProps`方法存在时，**并且props或context有变化** 时，要执行`callComponentWillReceiveProps`。
在这里需要特别注意一个事：当父组件更新时，子组件的`oldProps`与`newProps`始终是不相等的，所以父组件更新时，子组件的`componentWillReceiveProps`总是会被调用。但是当子组件更新state时，由于`oldProps`和`newProps`是相等的，所以不会调用`componentWillReceiveProps`。
在执行完`callComponentWillReceiveProps`后，如果更新队列`updateQueue!==null`，那么需要更新state的值，这里是直接调用`processUpdateQueue`更新state，所以不会触发二次更新。
```
if (
  typeof instance.componentWillReceiveProps === 'function' &&
  (oldProps !== newProps || oldContext !== newContext)
) {
  callComponentWillReceiveProps(
    workInProgress,
    instance,
    newProps,
    newContext,
  );
}

if (workInProgress.updateQueue !== null) {
  newState = processUpdateQueue(current,
    workInProgress,
    workInProgress.updateQueue,
    instance,
    newProps,
    renderExpirationTime,
  );
}
```
`callComponentWillReceiveProps`会调用组件的`componentWillReceiveProps`方法，并且如果state有改变，将更新加入到更新队列中。
```
function callComponentWillReceiveProps(
    workInProgress,
    instance,
    newProps,
    newContext,
) {
  startPhaseTimer(workInProgress, 'componentWillReceiveProps');
  const oldState = instance.state;
  instance.componentWillReceiveProps(newProps, newContext);
  stopPhaseTimer();
  // ....

  if (instance.state !== oldState) {
    updater.enqueueReplaceState(instance, instance.state, null);
  }
}
```

### shouldComponentUpdate(newProps, newState, newContext)
`shouldComponentUpdate`，在组件每次更新的时候都会调用，除非组件调用了`forceUpdate`。
同样在`updateClassInstance`方法中有这样一个逻辑，先计算`shouldUpdate`，然后根据shouldUpdate去判断是否执行更新
```
const shouldUpdate = checkShouldComponentUpdate(
  workInProgress,
  oldProps,
  newProps,
  oldState,
  newState,
  newContext,
);
if (shouldUpdate) {
  // 执行更新
}
```
在`checkShouldComponentUpdate`函数中，从`workInProgress.updateQueue.hasForceUpdate`这句话我们可以知道，如果在更新过程中有调用`forceUpdate`方法，会跳过`shouldComponentUpdate`方法，执行更新流程。
```
function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext) {
  if (oldProps === null || (workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate)) {
    // If the workInProgress already has an Update effect, return true
    return true;
  }

  const instance = workInProgress.stateNode;
  const type = workInProgress.type;
  // 如果有`shouldComponentUpdate`，就执行它，并将其返回值赋值给`shouldUpdate`
  if (typeof instance.shouldComponentUpdate === 'function') {
    startPhaseTimer(workInProgress, 'shouldComponentUpdate');
    const shouldUpdate = instance.shouldComponentUpdate(newProps, newState, newContext,);
    stopPhaseTimer();
  }
  return shouldUpdate;
}
```

### componentWillUpdate(newProps, newState, newContext)
在`updateClassInstance`方法中，当`shouldUpdate`为true时就会执行更新程序，如果`componentWillUpdate`存在，就会执行它
```
if (shouldUpdate) {
  if (typeof instance.componentWillUpdate === 'function') {
    startPhaseTimer(workInProgress, 'componentWillUpdate');
    instance.componentWillUpdate(newProps, newState, newContext);
    stopPhaseTimer();
  }
}
```

### componentDidUpdate(prevProps, prevState)
在`updateClassInstance`方法中，当`shouldUpdate`为true时就会执行更新程序，如果`componentDidUpdate`存在，设置`effectTag`为`Update`，并等待更新完成。
```
if (shouldUpdate) {
  if (typeof instance.componentDidUpdate === 'function') {
    workInProgress.effectTag |= Update;
  }
}
```
在`componentDidMount`的分析中提到，（当组件更新完成，会执行`commitLifeCycles`方法，逻辑为：如果当前组件第一次Mount，那么执行，如果已经装载过，则执行`componentDidUpdate`）。
```
if (current === null) {
  // 执行componentDidMount
} else {
  // 执行componentDidUpdate
  const prevProps = current.memoizedProps;
  const prevState = current.memoizedState;
  startPhaseTimer(finishedWork, 'componentDidUpdate');
  instance.props = finishedWork.memoizedProps;
  instance.state = finishedWork.memoizedState;
  instance.componentDidUpdate(prevProps, prevState);
  stopPhaseTimer();
}
```

## 总结
### React宏观上的渲染
React数据传递是置顶向下的，React整体上的渲染也是置顶向下的。可以将React组件的渲染操作想象成一个先入先出的队列，组件入队列之前执行render以及render之前的生命周期函数，出队列之前执行render之后的生命周期函数。如下所示：
```
// 组件第一次加载
parent constructor → parent will mount → parent render → child constructor → child will mount → child render → child did mount → parent did mount
// 组件更新
parent will update → parent render → child will update → child render → child did update → parent did update
```
### 从源码看组件的渲染
在组件开始渲染时，Fiber会首先创建一颗Fiber tree，并clone一个的副本：workInProgress。
更新时，对比current和workInProgress的差异，Fiber将有变化的Component的effectTag为Update。
在对比current和workInProgress的过程中会调用constructor、componentWillMount、componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate。如果在componentWillMount和componentWillReceiveProps中调用了setState，对state的更改会被加入更新队列，随后将立即执行更新队列得到新的state。
当完成current和workInProgress比较后，Fiber就会执行Commit完成渲染，这个阶段会调用componentDidMount、componentDidUpdate、componentWillUnmount。如果componentDidMount、componentDidUpdate有调用setState，会触发二次渲染。

### 无状态组件的渲染
通过`Function`创建的组件是无状态组件，它是没有生命周期，也不需要管理state，每次都会被重新渲染。

### 有状态组件的渲染
通过`ES6 class`创建的组件是有生命周期函数的，可以管理自己的state。
这类组件的渲染分为了三个阶段：Mount、Unmount、Update。组件的Mount阶段只会在组件装载的时候执行一次，Update阶段会在组件props或state有变化时执行。
Mount阶段会执行的周期函数有：constructor、componentWillMount、render、componentDidMount。
Update阶段会执行的周期函数有：componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate

#### props变化引起的update
组件的props变化导致组件更新时，会调用componentWillReceiveProps。
注意：父组件每次更新后，传递给子组件的props都会变化。这就意味着父组件更新后，子组件默认都会更新。

#### state变化引起的update
组件自身的state变化导致组件更新时，不会调用componentWillReceiveProps。
注意：子组件更新不会引起父组件更新，因为在React中更新时局部的。

### 改变state
通过setState来更改组件的state，并且setState是一个异步的动作。调用`setState`对state的更改都会被放到更新队列中。所以在生命周期函数中调用setState后，立即访问state还会是旧的值。

### 性能优化
默认情况下，父组件更新，其下的所有子组件都会更新，因为虽然props的值没有变化，但是它的引用变了。
默认情况下，`shouldComponentUpdate`默认返回`true`，组件state即使没有变化，只要调用了`setState`，组件都会更新。
可以在`shouldComponentUpdate`里，通过判断oldProps和newProps的值是否相等，oldState和newState的值是否相等来控制组件的更新，达到性能优化的目的。
