---
title: 《深入React技术栈》学习笔记：Flux
date: 2017-12-22 13:53:21
tags: react
categories: React系列
---

## Flux的核心思想
* 数据和逻辑永远是单向流动的，即：unidirectional data flow
<div style="max-width: 800px">
{% asset_img flux架构.png %}
</div>

## Flux的组成
* 3大部分：
  - dispatcher（分发事件）
  - store（保存数据，同时响应事件并更新数据）
  - view（订阅store中的数据，并使用这些数据渲染相应页面）
* 其他部分：
  - controller-view（将view和store进行绑定）
  - action creators（创建action）

<div style="max-width: 760px">
{% asset_img flux工作流程图.jpg %}
</div>
> `Dispatcher`可以看成是 **central hub**；用户与界面交互会生成一个`action`，这个`action`通过`Action Creator`创建（每个action creator中封装了分发action的操作，即dispatch）；`store`负责数据的保存和修改，并注册一个callback用于监听`Dispatcher`分发的`action`，根据`action`来修改数据；当数据被修改后，`store`会发送一个`change event`，`controller-views`监听到这个event后会重新获取`store`中的数据，并调用自己的`setState()`，触发所有子组件的更新


## 使用Flux创建应用
### 目录结构
```
- src
  + actions
  + components  // 所有view相关的组件，包括controller-view
  + contants    // 存放用于区分actions的type常量
  + dispatcher
  + stores
  - app.js
```

### dispatcher
* 作用：用来分发事件
* 在React中使用flux的`Dispatcher`
  - 主要的方法有：`register(callback)`（注册一个监听器）、`dispatch(action)`（分发一个action）
```
import {Dispatcher} from 'flux'
const commentDispatcher = new Dispatcher()
export default commentDispatcher
```

### action creator
* 作用：用来创建action
  - action：一个javascript对象，用于描述一个事件以及需要改变的相关数据
```
{
  type: 'OPEN_LOGIN_DIALOG'
}
```
* `action creator`定义了一系列的操作函数
  - 函数内部逻辑：使用`dispatcher.dispatch`分发一个`action`
```
loadComment () {
  commentDispatcher.dispatch({
    type: types.LOAD_COMMENT,
    payload: {
      loading: true
    }
  })
}
```

### store
* 作用：负责存储数据、修改数据
* `store`的逻辑：
  - 定义存储数据的变量
  - 定义监听器：`store`会调用`dispatcher.register`方法注册一个监听器。当`dispatcher`的`dispatch`方法分发一个`action`时，`store`注册的监听器就会被调用，同时得到这个`action`作为参数。这个监听器的`callback`根据`action.type`来执行相应的修改数据的逻辑，在数据修改后触发一个更新事件
  - 暴露获取数据、监听数据改变的方法
```
// 定义存储数据的变量
let data = {loading: false, comment: []}
// 暴露一个对象，这个对象有获取数据、监听数据改变的方法
const commentStore = {
  getComment () {
    return data
  },
  emitChange () {
    emitter.emit('change')
  },
  addChangeListener (callback) {
    emitter.on('change', callback)
  },
  removeChangeListenr (callback) {
    emitter.removeListener('change', callback)
  }
}
// 定义监听器
commentDispatcher.register(function (action) {
  switch (action.type) {
    case types.LOAD_COMMENT_SUCCESS:
      data = Object.assign({}, data, action.payload)
      // 发送一个更新事件
      commentStore.emitChange()
  }
})
export default commentStore
```

### controller-view
* 作用：是整个应用最顶层的view，监听`store`发送的`change event`，并重新获取数据传递给子组件
* `controller-view`的逻辑：
  - 初始化：调用`store`暴露的`getter`获取数据并设置为自己的state，在render时以props的形式传给自己的子组件
  - 注册监听器：监听数据更新的事件，`store`更新后，`controller-view`会重新获取store中的数据，然后调用`setState`触发界面重绘
  - 组件卸载时，移除监听器
```
class App extends Component {
  constructor () {
    super()
    this.state = {
      ...store.getComment()
    }
  }
  onChnage = () => {
    this.setState({
      ...store.getComment()
    })
  }
  componentDidMount () {
    actions.loadComment()
    store.addChangeListener(this.onChnage)
  }
  componentWillUnmount () {
    store.removeChangeListenr(this.onChnage)
  }
  render () {
    return (
      <div className='App'>
        <CommentList data={this.state.comment} />
      </div>
    )
  }
}
```

### view
* view层不能直接修改`store`中存储的数据，只能通过`dispatcher`分发事件，间接触发`store`更新数据
```
// 当提交评论时，调用actionCreator的addComment方法
onHandleClick = () => {
  ...
  action.addComment(newData)
  ...
}
```

---
* 完整代码：https://github.com/xiaoxiaojing/ToDoDo/tree/master/react/demo-comment-with-flux
* 参考文档
  - 《深入React技术栈》
  - [In Depth Overview](http://facebook.github.io/flux/docs/in-depth-overview.html#content)
