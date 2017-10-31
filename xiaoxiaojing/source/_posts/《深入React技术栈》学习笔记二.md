---
title: 《深入React技术栈》学习笔记二
date: 2017-10-31 19:51:09
tags:
categories: REACT
---

## 一、组件间抽象
* [代码示例](https://github.com/xiaoxiaojing/xiaoxiaojing.github.io/tree/hexo/example/react-stack/src/)

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

#### 高阶组件（higher-order component）
1. 概念：高阶组件，接受一个React组件作为输入，输出一个新的React组件
2. 实现高阶组件的方法
  * 属性代理（props proxy）：高阶组件通过被包裹的React组件来操作Props
  * 反向继承（inheritance inversion）：高阶组件继承于被包裹的React组件


3. 组合式组件开发实践
