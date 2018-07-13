---
title: ES6：Iterator和Generator
date: 2018-01-03 22:50:22
tags: es6
categories: ES6系列
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
> Perhaps the most interesting aspect of generator functions is that they stop execution after each yield statement

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

* 注意：**只能在生成器内使用`yield`**，在其他地方使用会有语法错误。即使在生成器中的函数内使用，也会有语法错误，因为`yield`不能跨越函数边界（connot cross function boundaries）

### 声明Generator
1. 将普通函数定义为`Generator`
```
function *generator() {
   yield 1
   yield 2
}
```
2. 将匿名函数定义为`Generator`
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
2. Iterable被用于`for-of`循环
3. ES6中的可迭代对象有
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
```
let collection = {
  items: [],
  *[Symbol.iterator]() {
    for (let item of this.items) {
      yield item;
    }
  }
};

collection.items.push(1);
collection.items.push(2);
collection.items.push(3);
// 遍历自定义的可迭代对象
for (let x of collection) {
    console.log(x);
}
```

## Iterable的基本用法
### 使用for-of遍历Iterable
* 作用：用于迭代`Iterable`(只能迭代Iterable，否则会报错)，不用跟踪索引，每次循环只关注对象内容
* 原理：初始时，`for-of`会调用对象的`Symbol.iterator`方法，得到一个迭代器。每次循环时，调用迭代器的`next()`方法，并将返回值赋值给`num`，当属性`done`为`true`时，退出循环（即，不会再执行循环中的语句）
```js
let values = [1, 2, 3];
for (let num of values) {
    console.log(num);
}
```

### 使用Spread Operator操作Iterable
* 作用：使用Spread Operator可以将Iterable转化为数组
* 原理：执行表达式`[...Iterable]`，`...`会使用`Iterable`的默认`iterator`，将每次返回的`value`依次插入到数组中
```
[...new Set([1, 2, 3, 3, 3, 4, 5])]  // [1, 2, 3, 4, 5]
[...[...new Map([["name", "Nicholas"], ["age", 25]])]] // [["name", "Nicholas"], ["age", 25]]
[...[1,2,3]] // [1,2,3]
[...'123'] // ["1", "2", "3"]
```

## Iterable的高级用法
### 使用迭代器（Iterator）的`next()`传递参数
1. 语法：使用`iterator.next(value)`传递参数
2. 功能：在`next()`中传入的参数，会作为上一个`yield`表达式的返回值
3. 实例解析：第一次调用next时，传入的任何值都会被忽略；第二次调用next后，首先将first的值设置为4，然后执行第二个yield后的语句；...
```
function *createIterator() {
   let first = yield 1;
   let second = yield first + 2;
   yield second + 3;
}
let iterator = createIterator();
console.log(iterator.next());  // "{ value: 1, done: false }"
console.log(iterator.next(4)); // "{ value: 6, done: false }"
console.log(iterator.next(5)); // "{ value: 8, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
```

### 使用迭代器的`throw()`处理错误
1. 语法：使用`iterator.throw(error)`抛出错误
2. 功能：调用`.throw`后，迭代器会在恢复执行时抛出一个错误，后面的语句都不会再执行，调用`throw`后再次调用`next`，都会返回`{ value: undefined, done: true }`
3. 实例解析：头两个yield正常执行，当调用`throw`时，在执行`let second`之前就会抛出错误，所以从给`second`赋值开始，后面语句都不会执行
```
function *createIterator() {
    let first = yield 1;
    let second = yield first + 2;  // yield 4 + 2, then throw
    yield second + 3;  // never is executed
}
let iterator = createIterator();
console.log(iterator.next());   // "{ value: 1, done: false }"
console.log(iterator.next(4));  // "{ value: 6, done: false }"
console.log(iterator.throw(new Error("Boom")));  // error thrown from generator
console.log(iterator.next()); // "{ value: undefined, done: true }"
```
4. 在`Generator`使用`try-catch`捕获错误
  * 当使用`try-catch`捕获错误后，Generator不会忽略后面的执行语句，会继续执行，所以当调用`throw()`后，执行`catch`中的语句，并继续执行下一个`yield`
```
function *createIterator() {
    let first = yield 1;
    let second;
    try {
        second = yield first + 2;
    } catch (ex) {
        second = 6;
    }
    yield second + 3;
}
let iterator = createIterator();
console.log(iterator.next());   // "{ value: 1, done: false }"
console.log(iterator.next(4));  // "{ value: 6, done: false }"
console.log(iterator.throw(new Error("Boom")));  // "{ value: 9, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
```

### 在Generator中使用return语句
* 原理：当执行`return`后，会将`done`设置为`true`，如果`return`后有值，会将这个值赋值给`value`
```
function *createIterator() {
    yield 1;
    return 42;
    yield 2;
    yield 3;
}
let iterator = createIterator();
console.log(iterator.next());   // "{ value: 1, done: false }"
console.log(iterator.next());   // "{ value: 42, done: true }"
console.log(iterator.next());   // "{ value: undefined, done: true }"
```

### 在Generator中调用其他Generator（Delegating Generators）
* 原理：使用`yield *`，可以迭代Iterable，当Iterable迭代完后，才会执行下一条语句
* 扩展：使用`yield *`可以用来迭代字符串
* 例子1：会首先执行完内部Generator的所有yield，再执行当前Generator的下一个yield
```
function *createNumberIterator() {
   yield 1;
   yield 2;
}
function *createCombinedIterator() {
   yield *createNumberIterator();
   yield true;
}
var iterator = createCombinedIterator();
console.log(iterator.next());   // "{ value: 1, done: false }"
console.log(iterator.next());   // "{ value: 2, done: false }"
console.log(iterator.next());   // "{ value: true, done: false }"
console.log(iterator.next());   // "{ value: undefined, done: true }"
```
* 例子2：内部Generator如果有返回值，则可以使用这个返回值
```
function *createNumberIterator() {
    yield 1;
    yield 2;
    return 3;
}
function *createRepeatingIterator(count) {
    for (let i=0; i < count; i++) {
        yield "repeat";
    }
}
function *createCombinedIterator() {
    let result = yield *createNumberIterator(); // 将返回值赋值给result
    yield *createRepeatingIterator(result); // 以参数的形式传递
}
```

## 内置迭代器（Built-In Iterators）
### 集合的迭代器（Collection Iterators）
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

### 字符串的迭代器（String Iterators）
* 使用for循环遍历字符串存在的问题：无法处理双字节字符（double-byte characters）
> 使用`[]`获取字符串中某个字符，但是`[]`获取的是`code units`而不是`character`。但是某些`character`是由两个`code units`组成的。

```
var message = "A 𠮷 B";
for (let i=0; i < message.length; i++) {
    console.log(message[i]); //打印结果里没有正确输出字符：`𠮷`
}
```

* 默认的字符串迭代器：每次循环获取的是`character`而不是`code units`
```
var message = "A 𠮷 B";
for (let c of message) {
    console.log(c) // 能够正确输出字符：`𠮷`
}
```

### NodeList的迭代器（NodeList Iterators）
* NodeList类型：是DOM具有的一种类型，用于表示页面文档中元素的集合
* NodeList的默认迭代器：由DOM规范定义，表现和数组的默认迭代器一致
```
var divs = document.getElementsByTagName("div");
for (let div of divs) {
   console.log(div.id);
}
```

## 处理异步任务
### 使用callback处理异步任务的缺点
* callback函数嵌套可能会很深
* 需要按顺序执行一系列异步操作，比较麻烦

### 使用Generator处理异步任务
* 原理：Generator执行时，遇到yield会暂停，直到下一次调用next时，才会重新开始执行
* task runner 示例
```
function run(taskDef) {
  // create the iterator, make available elsewhere
  let task = taskDef();

  // start the task
  let result = task.next();

  // recursive function to keep calling next()
  function step() {
    // if there's more to do
    if (!result.done) {
      if (typeof result.value === "function") {
        result.value(function(err, data) {
          if (err) {
            result = task.throw(err);
            return;
          }
          result = task.next(data);
          step();
        });
      } else {
        result = task.next(result.value);
        step();
      }
    }
  }
  // start the process
  step();
}

let fs = require("fs");
function readFile(filename) {
  return function(callback) {
    fs.readFile(filename, callback);
  };
}

run(function*() {
  let contents = yield readFile("config.json");
  doSomethingWith(contents);
  console.log("Done");
});
```
