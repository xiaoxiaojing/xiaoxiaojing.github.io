---
title: 《深入React技术栈》学习笔记一
date: 2017-10-29 14:45:40
tags:
categories: REACT
---
## 一、 React的特性
* 专注于View层
* Virtual DOM
* 函数式编程

### 虚拟元素（Virtual element）
1. Virtual element的构建与更新都是在内存中完成的。
2. Virtual element包括：DOM element 和 component element
  * **DOM element**：是一个JSON对象

  ```
	{
		type: 'button'
		props: {
			className: 'btn',
			children: [{
				type: 'em',
				props: {
					children: 'confirm'
				}
			}]
		}
	}
	// 以上对象可以对应下面这个真实DOM
	<button class="btn"><em>confirm</em></button>
	```

	* **component element**：是一个函数，这个函数返回一个DOM element

  ```
	const Button = ({color,  text}) => {
		return {
			type: 'button',
			props: {
				className: 'btn',
				children: {
					type: 'em',
					props: {
						children: text
					}
				}
			}
		}
	}
	```

## 二、JSX基本语法
1. XML基本语法
	* 最外层需要有一个标签包裹
	* 标签一定要闭合
    * 表达式要使用`{}`包裹
2. 元素类型
	* DOM元素: 首字母小写
	* 组件元素：首字母大写
3. 元素属性
	* `class`对应`className`
  * `for`对应`htmlFor`
  * 省略的Boolean属性，默认值是`true`
4. 通过命名空间的方式来分组元素，区分元素
  ```
  <MUI.RalseButton label="Default"/>
  ```

5. 注释
	```
	{/*注释*/}
	/* 多行
	   注释 */
	```
6. HTML转义：JSX会将特殊字符转义
    * 属性<span style="color:red">`dangerouslySetInnerHTML`</span>：用于设置要渲染的HTML，这时React不会转义字符

## 三、React组件
* 数据流：自顶向下单向流动（作用：让组件之间的关系变得简单且可预测）

### 1）组件构建方法
* `React.createClass`
* `ES6 classes`
* 无状态函数（`stateless function`）：没有state，也没有生命周期。无状态组件创建时只会保存一个实例，避免了不必要的检查和内存分配，做到了内存优化
<div style="width:400px;">
{% asset_img ES6Class和createClass创建组件的区别.jpg %}
</div>

### 2）组成：属性（props）+ 状态（state）+ 生命周期
<div style="width:400px;">
{% asset_img react_component_1.png %}
</div>
1. 属性（props）
    * 不可变的
    * 类型检查：`propTypes`（开发环境下才会进行类型检查，生成环境不会）
2. 状态（state）：管理组件的内部状态
    * 改变状态：`setState`。
        - 调用这个方法后，组件会尝试重新渲染
        - setState是一个异步的方法，一个生命周期内所有的setState方法会合并操作
3. 生命周期
<div style="width:600px;">
{% asset_img react_lifecycle_1.png %}
</div>
    * 组件第一次加载：（主要做组件状态的初始化）
        - 初始化props
        - 执行componentWillMount
        - 执行render
        - 执行componentDidMount
    * 组件卸载：
        - 执行componentWillUnmount：在这个方法中，执行一些清理方法，如事件回收或者清除定时器
    * 组件更新：父组件更新props或者子组件更新自身的state时会让子组件更新
        - 执行 componentWillReceiveProps(nextProps)：**只有父组件更新props时**，才会执行这个方法
        - 执行 shouldComponentUpdate(nextProps, nextState)：返回`false`时，下面的周期函数不会执行
        - 执行 componentWillUpdate(nextProps, nextState)
        - 执行 render
        - 执行 componentDidUpdate(prevProps, prevState)
    * 其他
        - 在生命周期方法里调用`setState`
            - componentWillMount: 组件会更新state，但是不会重新渲染，因为在这个阶段还没有开始渲染
            - componentDidMount: 组件会更新state, 会使得组件重新渲染
            - 不能在componentWillUpdate中执行
            - componentDidUpdate: 在这个方法中调用，会使得组件重新渲染
                ```
                // 这样更新state，组件会一直更新，最后会抛出溢出的错误（`warning.js:55 Uncaught RangeError: Maximum call stack size exceeded`)
                componentDidUpdate () {
                    this.setState({
                        count: count + 1
                    })
                }
                ```
            - componentWillReceiveProps: 在这个方法中调用，组件不会二次渲染
        - 无状态组件没有生命周期，无状态组件每次都会被渲染

### 3）React组件与真实DOM
1. ReactDOM：作用于DOM，只适用于Web端
    * ReactDOM.findDOMNode：
        - 语法：`ReactDOM.findDOMNode()`
        - 只能在componentDidMount,componentDidUpdate中调用，这个时候DOM才真正被添加到HTML中
        - 如果组件的render方法返回null，findDOMNode也返回null
    * ReactDOM.render：将Virtual DOM渲染到浏览器的DOM中
        - 语法：`ReactDOM.render(ReactElement element, DOMElement container, [function callback])`
        - 该方法把元素挂载到container中，并返回element的实例（即refs引用），如果ReactElement是无状态组件，那么ReactDOM.render()返回值为null
        - 组件再次更新时， React进行DOM diff算法做局部更新
    * ReactDOM.unmountComponentAtNode：卸载
    * **ReactDOM.unstable_renderSubtreeIntoContainer**：更新组件到传入的DOM节点上
        - 语法：`ReactDOM.unstable_renderSubtreeIntoContainer(parentComponent, nextElement, container, callback)`
2. refs：组件被创建时会新建一个该组件的实例，而refs就会指向这个实例。`ref`有两种值：
  - 回调函数：
  ```
  // 设置
  <input ref={(ref)=> this.myInput = ref}/>
  // 使用
  this.myInput.focus()
  ```
  - 字符串：
  ```
  // 设置
  <input ref="myInput"/>
  // 使用
  const myComp = this.refs.myInput //获取的是一个ReactElement的实例
  const dom = findDOMNode(myComp) //获取真实的DOM
  ```
3. React事件绑定
  * React提供了事件绑定功能，但是有些特殊情况需要自行绑定事件
  * 使用`addEventListener`和`removeEventListener`去自行绑定和解绑事件

### 4）智能组件（smart component）和木偶组件（dumb component）
* smart component：组件自己管理状态
* dumb component：父组件管理子组件的状态值，并将状态值传递给子组件

### 5）组件间通信
1. 父组件向子组件通信：通过props向子组件传递信息
2. 子组件向父组件通信：
  * 利用回调函数
  * 利用自定义事件机制
3. 跨级组件通信：使用context来实现
4. 没有嵌套关系的组件通信：使用发布/订阅模式，（EventEmitter）

## 四、事件系统
* React基于Virtual DOM实现了一个SyntheticEvent（合成事件）层。
* 支持`stopPropagation()`和`preventDefault()`。
* 所有事件自动绑定到最外层上。

### 1）合成事件（SyntheticEvent）的实现机制
1. 在React底层主要对合成事件做了两件事：事件委派和自动绑定
2. 事件委派：将事件绑定到结构的最外层
  <div style="width: 300px;">
  {% asset_img react_event1.png %}
  </div>
3. 自动绑定
  * 使用React.createClass创建的组件的每个方法的上下文都会指向该组件的实例。React还会对这种引用进行缓存，以达到CPU和内存的最优化。
  * 使用ES6 classes或者纯函数创建的组件，没有自动绑定的特性。
    ```
    // 在ES6 classes创建的组件中手动绑定this
    // 1. 使用bind
    constructor(){
      super()
      this.eventHandler = this.eventHandler.bind(this)
    }
    // 2. 使用箭头函数
    eventHandler = () => {}
    ```

### 2）在React中使用原生事件
* 通过`ref`获取组件实例并为其绑定原生事件
  ```
  this.refs.button.addEventListener('click', e => {})
  ```
* 给`<body>`绑定事件，body在组件范围之外只能通过绑定原生事件来实现
* 合成事件中调用`e.stopPropagation`，只能阻止React合成事件系统中的冒泡，无法阻止原生事件上的冒泡。但是原生事件中的阻止冒泡行为，可以阻止React合成事件系统中的冒泡
  ```
  // 综上所诉：给className为div的元素绑定合成事件，通过调用e.stopPropagation来阻止冒泡是没有效果的
  // 解决方案：通过以下方法来实现阻止冒泡：如果点击className为div的元素，不会继续执行下去
  document.body.addEventListener("click", (e)=>{
      if ( e.target && e.target.matches(".div") ) {
          return
      }
      this.setState({isOpen: false})
  })
  ```

### 3）React合成事件和JavaScript原生事件的对比
|项目|JavaScript原生事件|React合成事件|
|:---|:------------|:----------------|
|事件传播|事件捕获->自身事件处理->事件冒泡|自身事件处理->事件冒泡|
|阻止事件传播|`e.preventDefault()`(可能有兼容问题)|`e.preventDefault()`|
|事件类型|React合成事件的事件类型是JavaScript原生事件类型的一个子集||
|事件绑定方式|三种：<br/>`<a onclick="alert(1);"></a>`<br/>`el.onclick=()=>{}`<br/>`el.addEventListener('click', ()=>{})`|一种：<br/>`<a onClick={this.handler}></a>`|

## 五、表单
### 受控组件与不受控组件
1. 受控组件
  * 表单的值通过state来管理的组件是受控组件
  * 使用受控组件消除了组件的局部状态
2. 不受控组件
  * 通过`defaultValue`和`defaultChecked`来设置组件默认状态
3. 对比受控组件和非受控组件
  * 非受控组件的状态不会受到应用状态的控制，应用中也多了局部组件状态，而受控组件的值来自于组件的state
  * 性能上：受控组件会有一些性能上的损耗，因为表单的值发生变化时，都会调用一次onChange事件

## 六、样式处理
### 1.基本样式设置
* 使用className
  - 使用`classnames`库来动态拼凑类名
* 使用行内样式，设置style
  - 属性的值是像素值，可以直接使用数字，react会自动为其添加px

### 2.CSS模板化
1. css模板化的解决方案有：
  * Inline Style：使用JavaScript或JSON来写样式
  * {% post_link CSS-Modules CSS Modules %}：依旧使用CSS，但使用JavaScript来管理样式依赖。
