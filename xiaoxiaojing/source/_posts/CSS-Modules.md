---
title: CSS Modules
date: 2017-09-20 14:26:30
tags:
---

## 初探
1. CSS模块化遇到的问题
  * 全局污染
  * 命名混乱
  * 依赖管理不彻底：引入一个组件时，无法只引入这个组件需要的css样式
  * 无法共享变量：预编译语言不能提供跨JavaScript和CSS共享变量的这种能力
  * 代码压缩不彻底

2. CSS Modules是模块化CSS的一种解决方案
  * CSS Modules内部通过ICSS来解决样式导入和导出的问题，分别对应`:import`和`:export`两个伪类

### 使用Css Modules
1. 启用CSS Modules（in webpack）
  ```
  // webpack 版本不一样，配置方法不一样
  css?modules&localIdentName=[name]_[local]-[hash:base64:5]
  //or
  {
     test: /\.css$/,
     loader: 'css-loader',
     query: {
         modules: true,
         localIdentName: "[name]__[local]__[hash:base64:5]"
     }
   }
  ```

2. 在组件中调用
  ```
  import styles from './index.css'
  console.log(styles)  //is a Object
  ```

### 特殊语法
1. 样式默认是局部的
  ```
  // 显示定义成局部样式
  :local(.normal){}
  ```

2. 启用全局模式
  ```
  // 定义一个全局样式
  :global(.btn) {
    color: red
  }
  // 定义多个全局样式
  :global(
      .btn {color: red}
      .btn1 {color: green}
  )
  ```

3. 通过`composes`组合样式
  * 也可以组合多个样式`composes: classNameA classNameB`
  ```
  .base {/*所有通用样式*/}
  .normal {
    composes: base;
    /*normal 的其他样式*/
  }
  // 应用
  <button class=${styles.normal}></button>
  // 生成后
  <button class="button--base-abc12 button-normal-abc32"></button>
  ```

4. 通过`composes`继承样式
  * 不能形成循环引用，可能会发生错误
  ```
  /* base.css */
  .base {}
  /* normal.css */
  .normal {
    composes: className from './style.css'
  }
  ```

5. 使用`:export`关键字
  ```
  // base.css
  :export {
    primaryColor: #fff
  }
  // base.js
  import style from 'base.css'
  console.log(style.primaryColor) // #fff
  ```

### CSS Modules的优点
1. 所有样式都是局部化的，解决了命名冲突和全局污染问题
2. class名的生成规则配置灵活
3. 建立js文件和css文件的依赖关系

### 实践中的一些问题
1. 一个css文件中多个同名的class，编译后仍是同名的
2. 外部覆盖局部样式：使用属性选择器
3. 引入全局样式：通过webpack配置
  ```
  {
    test: /\.scss$/,
    exclude: path.resolve(__dirname, 'src/styles'),
    loader: 'style!css?modules&localIdentName=[name]__[local]!sass?sourceMap=true',
  }
  //这样配置后，将全局样式文件放置到src/styles目录下，全局样式就不会被编译
  ```
4. 使用`react-css-modules`库来避免重复书写`styles.**`


-----

-----
# Interoperable CSS（[ICSS](https://github.com/css-modules/icss)）
以下是翻译
- - -
* 这篇文章说明了启用CSS Modules的low-level文件格式的规范。这篇文章主要是给loader（这个loader是指webpack的css-loader这类插件）开发人员看的。

## Rationale
* CSS需要和JavaScript一样趋向组件化开发。CSS在这方面的进步都是相当传统，且没有被CSS支持。例如[BEM](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)，它有一些特点：
  - 样式作用于单个组件
  - 所有的CSS选择器都是全局的
  - 确定一些书写规范保证选择器名的全局唯一性

### Explicit cross-language dependencies
* Webpack的一个特性是能够明确地描述每个文件的依赖关系，不管这个文件是什么类型。所以CSS文件可以这样引入
  ```
  require( './my-component.css' )
  var MyComponent = // component definition
  module.exports = MyComponent
  ```
* 现在，无论`my-component.js`是装载还是卸载，CSS文件和组件的依赖关系是一直保持的

### CSS - JS interoperability
* 建立了CSS文件和JS文件的依赖关系，我们就可以将CSS中的变量传递给JS（pass variables from css to JS)
  ```
  var styles = require('./my-component.css')
  elem.addClass( styles.elemClass ) //我们可以使用styles来获取css中的变量
  ```

## Specification
* ICSS是标准CSS的超集，使用两个额外的伪选择器：
  ```
  :import("path/to/dep.css") {
    localAlias: keyFromDep;
    /* ... */
  }
  :export {
    exportedKey: exportedValue;
	  /* ... */
  }
  ```

### `:export`
* `:export`关键词可以把css中的变量输出到JavaScript中，等价于
  ```
  module.exports = {
    "exportedKey": "exportedValue"
  }
  ```
* `:export`语法有以下限制
  - 必须在最顶层(也就说不能这样写`.base:export{}`, 冒号前面不能有其他选择器)，但是可以在文件的任何地方
  - 如果一个文件中有多个`:export`，会将key/value合并并一起导出
  - 如果定义了重复的`exportedKey`，会只取最后一个
  - `exportedValue`可以是任何css的属性值，包括空格
  - `exportedValue`会被视为一个字符串，所以不需要用引号包裹
* `:export`语法建议的但是不强制：
  - 一个文件应该只有一个`:export`
  - 应该写在文件的顶部，并且在所有`:import`的后面

### `:import`
* `:import`语法允许从其他css文件引入变量(css-loader似乎没有实现这个功能额？)
* `:import`的执行步骤
  - 获取并处理依赖
  - Resolve the dependency's exports against the imported tokens, and match them up to a `localAlias`
  - Find and replace the usages of `localAlias` in certain places (described below) within the current file with the dependency's `exportedValue`
* 在css文件中会检查`localAlias`的地方
  - 属性的值：`border: 1px solid localAlias`
  - 选择器：`.localAlias .MyComponent {}`
  - 媒体查询的参数：`@media screen and localAlias`
* `:import`的语法规则
  - must be at the top low-level
  - 每个文件可以import多个依赖，多个symbols
  - `localAlias`命名必须是唯一的，且只包含字母、数字、字符、下划线和破折号。
* `:import`的其他规则，但是不强制
  - There should be one import per dependency
  - All imports should be at the top of the file
  - local aliases should be prefixed with double-underscore
- - -

* 参考书籍：**《深入React技术栈》**
* 参考链接：[css-modules](https://github.com/css-modules/css-modules)
