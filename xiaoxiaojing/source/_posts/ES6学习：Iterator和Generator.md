---
title: ES6学习：Iterator和Generator
date: 2018-01-03 22:50:22
tags: es6
categories: ES6
---

## 前言
1. 普通的for循环存在的问题：
  * 在循环里，需要跟踪索引，意思就是：需要声明一个变量来存储索引，并且每次循环后要更新其值。
2. 迭代器（Iterators）可以消除循环（loop）的复杂性和易错性

## 迭代器（Iterator）
> Iterators are objects with a specific interface designed for iteration

* 定义：迭代器（Iterator）是一个有特定结构的对象，专门用于迭代。
* 结构：一个迭代器的基本结构如下
```js
{
  // have a next() method that returns a result object
  next: function () {
    return {
      value, // next value
      done   // a Boolean that’s true when there are no more values to return
    }
  }
}
```
* 🌰：创建一个迭代器
```js
function createIterator (items) {
  var i = 0
  return {
    next: function () {
      const done = i >= items.length ? true : false
      const value = done ? undefined : items[i++]

      return {
        value,
        done
      }
    }
  }
}
const iterator = createIterator([1, 2])
iterator.next() // {value: 1, done: false}
iterator.next() // {value: 2, done: false}
iterator.next() // {value: undefined, done: true}
```

## 生成器（Generator）
* 定义：生成器（Generator）是一个用于创建迭代器（Iterators)函数（函数结构如下）。
``` js
// 使用`*`声明一个生成器
function *generator() {
   yield 1
   yield 2
}

const iterator = generator()
// 每次调用next方法，会逐条按顺序返回yeild后面的值
iterator.next() // {value: 1, done: false}
iterator.next() // {value: 2, done: false}
iterator.next() // {value: undefined, done: true}
```
* 特点：每个`yield`执行后，函数会暂停直到再次调用`next()`
> Perhaps the most interesting aspect of generator functions is that
they stop execution after each yield statement

```js
function *createIterator(items) {
    // 循环时，每次遇到yield，循环就会停止
    // 每次调用next后，循环会继续继续，直到再次遇到yield
    for (let i = 0; i < items.length; i++) {
        // yield 后面可以是任意 value or expression
        yield items[i]
    }
}
let iterator = createIterator([1, 2])
iterator.next() // {value: 1, done: false}
iterator.next() // {value: 2, done: false}
iterator.next() // {value: undefined, done: true}
```

* 注意：只能在生成器内使用`yield`，在其他地方（包括在生成器中的函数内使用`yield`）使用会有语法错误。因为`yield`不能跨域函数边界（connot cross function boundaries）

### 声明Generator
1. 将普通函数定义为Generator
```
function *generator() {
   yield 1
   yield 2
}
```
2. 将匿名函数定义为Generator
```
const generator = function *() {
  yield 1
  yield 2
}
```
3. **不能** 将 **箭头函数** 定义为Generator

### 将Generator作为对象的方法
1. ES5风格
```
const obj = {
	generator: function *() {
		yield 1
   		yield 2
	}
}
```

2. ES6风格
```
const obj = {
	*generator() {
		yield 1
   		yield 2
	}
}
```

## 可迭代对象（Iterable）
1. 定义：是一个有特殊属性(`Symbol.iterator`)的对象
  - `Symbol.iterator`：指向一个函数，这个函数会返回给定对象的**生成器（Generator）**
2. ES6中的可迭代对象有
  - collection objects (arrays, sets, and maps)
  - strings
  - 通过Generator生成的Iterator

### 使用Symbol.iterator
1. 获取`Iterable`默认的迭代器（Iterator）
```
let values = [1, 2, 3]
let iterator = values[Symbol.iterator]() // 获取迭代器
```

2. 判断对象是否是可迭代对象
```
function isIterable(object) {
    return typeof object[Symbol.iterator] === "function"
 }
```

3. 创建可迭代对象：给一个对象定义`Symbol.iterator`属性，并设置属性的值为一个`Generator`，这个对象就变成了可迭代对象

### 使用for-of遍历Iterable
* 作用：用于迭代`Iterable`(只能迭代Iterable，否则会报错)，不用跟踪索引，每次循环只关注对象内容
* 原理：初始时，`for-of`会调用对象的`Symbol.iterator`方法，得到一个迭代器。每次循环时，调用迭代器的`next()`方法，并将返回值赋值给`num`，当属性`done`为`true`时，退出循环
```js
let values = [1, 2, 3];
for (let num of values) {
    console.log(num);
}
```

## 内置迭代器（Built-In Iterators）
### 集合迭代器（Collection Iterators）
* ES6中的集合对象（Collection Object）：Array，Map，Set。这些对象可以通过以下方法获取内置迭代器，如下：
  1. entries()
    - 通过`entries()`获取的迭代器的value是一个数组`[key,value]`，`Set`的`key`和`value`是一样的
  2. values()
  3. keys()
    - `Array.keys()`获取的迭代器，只会迭代`numeric key`
* 集合对象的属性`Symbol.iterator`生成的默认迭代器分别为：
  1. Array -> values()
  2. Set -> values()
  3. Map -> entries() (所以，使用for-of循环Map时，得到是`[key, value]`)


## Advance
## Async
