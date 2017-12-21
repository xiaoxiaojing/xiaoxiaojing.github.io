---
title: 《深入React技术栈》学习笔记：高阶函数
date: 2017-10-31 19:51:09
tags: react
categories: REACT
---

## 一、组件间抽象
* [代码示例](https://github.com/xiaoxiaojing/xiaoxiaojing.github.io/tree/hexo/example/react-stack/src)

### mixin
1. 作用：实现多重继承
2. 广义的mixin方法：就是用赋值的方法将mixin对象里的方法都挂载到原对象上，来实现对对象的混入。
3. React中的mixin
  * 多个mixin有相同方法时
    - 生命周期方法：会将各个mixin的生命周期方法叠加在一起顺序执行
    - 普通方法：不同的mixin里实现两个名字一样的普通方法，会报错`Uncaught Error: ReactClassInterface`，指出你尝试在组件中多次定义一个方法，这会造成冲突
  ```
  // 这段代码执行后，会依次输出mixin1, mixin2, class，表明生命周期方法合并在一起顺序执行
  var Mixin1 = {
    componentWillMount: function() {
      console.log('mixin1')
    },
    setInterval: function() {
      console.log('setInterval')
    }
  }
  var Mixin2 = {
      componentWillMount: function() {
        console.log('mixin2')
      },
      //这个方法和Mixin1中的重名，且它是一个普通方法。会报错ReactClassInterface
      /*setInterval: function() {
        console.log('setInterval')
      }*/
  }
  React.createClass({
    mixins: [Mixin1, Mixin2]
    componentWillMount: function(){
      console.log('class')
    }
  })
  ```

3. ES6 Classes 与 decorator： 实现mixin
4. mixin的问题
  * 破坏了原有组件的封装
  * 命名冲突
  * 增加了复杂性

### 高阶组件（higher-order component）
1. 概念：接受一个React组件作为输入，输出一个新的React组件
2. 实现高阶组件的方法
  * 属性代理（props proxy）
    - 使用属性代理构建高阶组件时，组件执行生命周期的过程类似于**堆栈调用**
      ```
      // HOC didmount：指的是高阶组件的didmount （以此类推）
      didmount -> HOC didmount -> (HOCs didmount) -> (HOCs will umount) -> HOC will unmount -> unmount
      ```
  * 反向继承（inheritance inversion）
    - 高阶组件返回的组件继承于WrappedComponent
    - 使用反向继承构建高阶组件时，组件执行生命周期的过程类似于**队列**
      ```
      didmount -> HOC didmount -> (HOCs didmount) -> will unmount -> HOC will unmount -> (HOCs will unmount)
      ```
3. 高阶组件的组件命名：当使用高阶组件生成新组件时，新组件的`displayName`为`undefined`
  * 使用属性`displayName`为新组件添加名字，两种方式
    ```
    // 组件外部
    class HOC extends WrappedComponent {
    }
    HOC.displayName = `HOC(${getDisplayName(WrappedComponent)})`
    // 组件内部
    class HOC extends WrappedComponent {
      static displayName = `HOC(${getDisplayName(WrappedComponent)})`
    }
    ```
4. 高阶组件传参
  ```
  function HOCFactoryFactory(...params) {
      return function HOCFactory(WrappedComponent) {
          return class HOC extends Component {
              render () {
                  return <WrappedComponent {...this.props}/>
              }
          }
      }
  }
  // 调用
  @HOCFactoryFactory(params)
  class WrappedComponent extends Component {}
  ```

#### 属性代理实现的高阶组件的功能
1. 控制props
  * 可以读取、增加、编辑或者移除从`WrappedCompoent`传进来的props
  * 🌰：给原组件增加一个props：text。（对于原组件来说，只要套用这个高阶组件，得到的新组件就会多一个prop：text）
    ```
    const MyContainer = (WrappedComponent) =>
        class extends Component {
            render () {
                // 新增的props
                const newProps = {
                    text: 'newText'
                }
                return <WrappedComponent {...this.props} {...newProps}/>
            }
        }
    ```

2. 通过refs获取原组件的引用
  * 🌰：当`WrappedComponent`被渲染时，refs回调函数就会被执行，例子中的`proc`函数就会拿到`WrappedComponent`的引用。这样就可以调用原组件的方法。
    ```
    const MyContainer = (WrappedComponent) =>
        class extends Component {
            proc (instance) {  //获取到原组件实例的引用
                console.log(instance.method());
            }
            render () {
                // 新增的props
                const newProps = {
                    text: 'newText',
                    ref: this.proc.bind(this)
                }
                return <WrappedComponent {...this.props} {...newProps}/>
            }
        }
    ```
3. 抽象state
  * 无状态的组件（展示组件）：不需要管理state
  * 高阶组件可以将原组件抽象成无状态组件。即是：将原组件的状态管理提到高阶组件中进行。
4. 使用其他元素包裹`WrappedComponent`
  * 通过这个功能给可以给原组件添加 **样式**、**布局** 等

#### 反向继承实现的高阶组件的功能
1. 渲染劫持
  * 概念：就是在render阶段，通过控制props或操作原组件的RenderTree来渲染不同的结果。(注意使用`super.render()`)
  ```
  const MyContainer = (WrappedComponent) =>
      class extends WrappedComponent {
          render () {
              if (this.props.loggedIn) {
                  return super.render()
              } else {
                  return null
              }
          }
      }
  ```

2. 控制state
  * 高阶组件可以读取、修改或删除原组件实例的state。也可以增加state，但是可能会让原组件内部状态变得一团糟。
    ```
    componentDidMount () {
        this.setState({
            msg: "msg be changed", //修改
            copyMsg: this.state.msg, //读取
            newMsg: 'new msg' //增加
        })
    }
    ```

### 组合式组件开发实践
* 组合式组件开发：基础组件与高阶组件相结合，使得组件更灵活，更易扩展。其架构如下：
  <div style="max-width:600px;">
  {% asset_img 组合式组件架构.jpg %}
  </div>
* 结合Decorator，来封装基础组件
  <div style="max-width:600px;">
  {% asset_img 使用Decorator来封装基础组件.png %}
  </div>
* 完成一个小demo：有三个组件（Select，Search，SearchSelect），如下图所示：
  <div style="max-width:400px;">
  {% asset_img 三个公共组件.jpg %}
  </div>

#### 组件再分离
* 将组件分成更小的粒度
  - Select = SelectInput + List
  - Search = SearchInput + List
  - SearchSelect = SelectInput + SearchInput + List
* 最小粒度的组件应该是一个**无状态组件**，如`SelectInput`
  ```
  export default function SelectInput ({
      selectItem,
      onClick
  }) {
      return (
          <input value={selectItem} onClick={onClick}/>
      )
  }
  ```

#### 逻辑再抽象
* 使用高阶组件完成组件逻辑上的抽象，假设有两个高阶组件
  - SelectDecorator：修饰Select，在高阶组件中管理Select的事件和state
    ```
    const SelectDecorator = (WrappedComponent) =>
        class extends Component {
            constructor (props) {
                super(props)
                this.state = {
                    isOpen: false,
                    selectItem: ""
                }
            }
            onSelect = (value) => {
                this.setState({
                    isOpen: false,
                    selectItem: value
                })
            }
            onClick = () => {
                this.setState({
                    isOpen: true
                })
            }
            render () {
                const newProps = {
                    onSelect: this.onSelect,
                    onClick: this.onClick,
                    isOpen: this.state.isOpen,
                    selectItem: this.state.selectItem
                }
                return (
                    <WrappedComponent {...this.props} {...newProps}/>
                )
            }
        }
    ```
  - SearchDecorator：修饰Search，在高阶组件中管理Search的事件和state，并控制传入的props
    ```
    const SearchDecorator = (WrappedComponent) =>
        class extends Component {
            constructor (props) {
                super(props)
                this.state = {
                    value: ""
                }
            }
            onChange = (e) => {
                this.setState({
                    value: e.target.value
                })
            }
            render () {
                const value = this.state.value
                const newProps = {
                    value,
                    onChange: this.onChange,
                    items: this.props.items.filter((item)=>{
                        return item.match(value)
                    })
                }
                return (
                    <WrappedComponent {...this.props} {...newProps}/>
                )
            }
        }
    ```
* 对于SearchSelect就可以使用`SelectDecorator`和`SearchDecorator`来修饰，使其同时具有Select和Search的功能
  ```
  @SelectDecorator
  @SearchDecorator
  export default class SearchSelect extends Component {
    //...
  }
  ```

## 二、组件性能优化
### 1. 防止不必要的渲染，即（PureRender）
* Pure：是纯函数的概念
* 使用`PureComponent`： {% post_link React学习：PureComponent的使用 %}
* 使用`Immutable`
* 给动态子项添加合适的`key prop`

#### 纯函数
1. 纯函数的三大原则：
  * 给定相同的输入，它总是返回相同的输出：`y = f(x)`
    - 例如：Math.random()就是不纯的
  * 过程没有副作用（side effect）（即不改变外部状态）
    - 在JavaScript中，如果方法的参数是对象或数组，那么这些对象和数组有可能被方法执行的过程改变
  * 没有额外的状态依赖
    - 方法内的状态都只在方法的生命周期内存活
2. React组件本身就是纯函数
  * React的`createElement`方法保证了组件是纯净的，即传入指定`props`得到一定的`Virtual DOM`
3. 优点
  * 可以让方法或组件更加专注（focused）、体积更小（small）、更独立（independent）、更具有复用性（reusability）和可测试性（testability）

#### Immutable
1. 使用普通变量存在的问题：
  * 对象或数组是可变的且是引用类型，新的对象简单地引用了原始对象，改变新的对象将影响到原始对象
  * PureComponent在判断组件是否需要更新时，不正确的对象或数组的使用会导致组件更新出现问题，参考{% post_link React学习：PureComponent的使用 %}
2. Immutable Data
  * 是不可变数据
  * 对Immutable对象进行修改、添加或删除操作，都会返回一个新的Immutable对象
3. 实现原理：
  * Immutable是持久化的数据结构（persistent data structure)：使用旧数据创建新数据时，要保证旧数据同时可用且不变
  * 使用了结构共享（structural sharing)：如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其他节点则进行共享
4. 注意点
  * 使用了结构共享，没有变化的节点会被共享，使用`===`来比较`Immutable`对象的内存地址
    ```
    let a = Immutable.Map({
       select: 'user',
       filter: Immutable.Map({name: 'a'})
    })
    let b = a.set('select', 'people')
    a === b // false
    a.get('filter') === b.get('filter') // true
    ```
