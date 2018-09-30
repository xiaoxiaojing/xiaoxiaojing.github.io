---
title: ES6：函数
date: 2018-07-03 22:12:22
tags: es6
categories: ES6系列
---

## 函数的参数
### 默认参数的实现
#### in ES5
* 方法1：使用`||`判断参数是否提供(不安全，值为0时会被认为是false而使用默认值)
* 方法2：使用`typeof param !== "undefined"`判断参数是否提供

#### in ES6
ES6的默认参数：未提供参数或者参数是`undefined`时，会使用默认值

```
function func(arg='test') {
  console.log(arg)
}

// 使用默认值
func()          // 'test'
func(undefined) // 'test'

// 禁用默认值
func(null)      // null
```

### 默认参数的值
参数的默认值可以是一个简单值，也可以是一个**函数调用表达式**
```
function getValue() {
    return 5;
}

function add(first, second = getValue()) {
    return first + second;
}
```

函数调用表达式的调用时机：第二个参数缺失并且调用`add()`方法时，会执行该函数调用表达式。（当`add()`函数编译时不会执行该函数调用表达式）
```
let value = 5;

function getValue() {
    return value++;
}

function add(first, second = getValue()) {
    return first + second;
}

console.log(add(1, 1));     // 2
console.log(add(1));        // 6
console.log(add(1));        // 7
```

### 参数的访问
后面的参数可以访问前面的参数，反之则不能
【原因】：默认参数也有`TDZ`，当默认参数被初始化后才会从`TDZ`中移除，该参数才可以被访问。
```
function add(first, second = first) {
    return first + second;
}
console.log(add(1, 1));     // 2
console.log(add(1));        // 2

function add(first = second, second) {
    return first + second;
}
console.log(add(undefined, 1)); // throws error
```

### Unnamed Parameters
#### in ES5
使用arguments来获取多余的参数

#### in ES6
使用`rest parameters`来处理参数，如下：key是rest parameter 
```
function pick(object, ...keys) {
    let result = Object.create(null);

    for (let i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = object[keys[i]];
    }

    return result;
}
```

`rest parameters`的一些限制：
* rest parameter只能有一个，并且是最后一个参数
* rest parameter不能在对象的访问器属性setter中使用

### 默认参数对arguments的影响
1. ES5非严格模式下，直接修改参数值会影响到arguments
```
function mixArgs(first) {
    console.log(first === arguments[0]);   // true
    first = "c";
    console.log(first === arguments[0]);   // true
}
```

2. ES5严格模式下，直接修改参数值不会影响到arguments
```
function mixArgs(first) {
    console.log(first === arguments[0]);   // true
    first = "c";
    console.log(first === arguments[0]);   // false
}
```

3. ES6中，直接修改参数值不会影响到arguments；并且设置了默认值的参数缺失时，将会使用默认参数，这时该参数和arguments没有关联
```
function mixArgs(first, second = "b") {
    console.log(arguments.length);         // 1
    console.log(first === arguments[0]);   // true
    console.log(second === arguments[1]);  // false
    first = "c";
    second = "d"
    console.log(first === arguments[0]);   // false
    console.log(second === arguments[1]);  // false
}
mixArgs("a")  // second缺失
```

## Function函数
### 作用
使用`Function`动态的创建一个函数
```
var add = new Function("first", "second", "return first + second");

console.log(add(1, 1));     // 2
```

### 在ES6中的特性
可以使用default parameter和rest parameter
```
var add = new Function("first", "second = first", "return first + second");
console.log(add(1));        // 2

var pickFirst = new Function("...args", "return args[0]");
console.log(pickFirst(1, 2));   // 1
```

## 函数的属性：name
1. 正常情况下name的值：是函数声明或函数表达式声明
```
function doSomething() {
    // empty
}
var doAnotherThing = function() {
    // empty
};

console.log(doSomething.name);     // "doSomething"
console.log(doAnotherThing.name);  // "doAnotherThing"
```

2. 特殊情况下name的值
  * 同时有函数声明和函数表达式声明，name的值是函数声明
  * 对象迭代器函数，name值会加上前缀：`get`or`set`
  * 使用`bind()`创建的新函数，name值会加上前缀：`bound`
  * 通过`new Function()`创建的新函数，name值为：`anonymous`
```
var doSomething = function doSomethingElse() {
    // empty
};

var person = {
    get firstName() {
        return "Nicholas"
    },
    sayName: function() {
        console.log(this.name);
    }
}

console.log(doSomething.name);         // "doSomethingElse"
console.log(person.sayName.name);      // "sayName"
console.log(person.firstName.name);    // "get firstName"
console.log(doSomething.bind().name);  // "bound doSomething"
console.log((new Function()).name);    // "anonymous"
```

## 判断函数是否是构造函数
JavaScript的函数有两个内置方法：`[[Call]]` 和 `[[Construct]]`
使用`new`操作符调用函数时，会执行`[[Construct]]`方法，否则执行`[[Call]]`方法（箭头函数没有`[[Construct]]`方法，所以不能作为构造函数）

### in ES5
通过函数中的`this`对象的实例来判断函数是否作为构造函数
存在的问题：不使用`new`运算符（例如：使用`call`方法调用函数），`this`的实例也有可能是`Person`
```
function Person(name) {
    if (this instanceof Person) {
        this.name = name;
    } else {
        throw new Error("You must use new with Person.")
    }
}
var person = new Person("Nicholas");  // works!
var notAPerson = Person("Nicholas");  // throws an error
var notAPerson2 = Person.call(person, "Michael");    // works!
```

### in ES6
使用一个metaproperty：`new.target`来判断函数是否作为构造函数
当执行`[[Call]]`方法，`new.target`的值是`undefined`
当执行`[[Construct]]`方法，`typeof new.target === Person`


## Block-Level Functions
在ES6中，在`{}`创建的`block`中声明的函数，这个函数是`Block-Level Functions`。
`Block-Level Functions`是以函数声明方式创建的，而不是使用函数直接量来创建的。
严格模式下，`Block-Level Functions`只能在当前block中被访问，并且会提升到该block的顶部。
非严格模式下，`Block-Level Functions`会被提升到全局作用域的顶部


## Arrow Functions
### 定义
```
let fun = () => {}

typeof func               // "function"
func instanceof Function  // true
```

### 箭头函数和普通函数的区别
1. 箭头函数内部的变量：`this`，`super`，`arguments`，`new.target`，与包含该箭头函数的最近非箭头函数相关联
  * `this`在箭头函数声明时被指定，并且**不能被更改**，在函数的整个生命周期中保持不变
  * `arguments`变量不存在
2. 箭头函数不能作为构造函数（因为箭头函数没有`[[Construct]]`方法）
3. 箭头函数没有`prototype`属性
4. 箭头函数的参数的命名不能重复
```
var aa = (a, a) => {} // Uncaught SyntaxError: Duplicate parameter name not allowed in this context
```

## 尾调用（Tail Call）
1. 定义：函数的最后一个执行语句是一个函数调用。
```
function doSomething() {
  return doSomethingElse();   // tail call
}
```

2. 尾调用存在的问题：栈溢出
3. ES6在严格模式下对尾调用做了优化，当满足以下情况，当前`stack frame`就会被清空并重用
  * 当前函数不是一个闭包（closure），即该尾调用不会访问当前栈帧中变量
  * 该尾调用返回后，创建尾调用的函数没有其他工作要做
  * 该尾调用的返回值作为该函数的返回值
4. 尾调用优化失效的情况有：
```
"use strict";
function doSomething() {
  // not optimized - no return
  doSomethingElse();
}

function doSomething() {
  // not optimized - must add after returning
  return 1 + doSomethingElse();
}

function doSomething() {
  // not optimized - call isn't in tail position
  var result = doSomethingElse();
  return result;
}

function doSomething() {
  var num = 1,
      func = () => num;
  // not optimized - function is a closure
  return func();
}
```
4. 利用ES6在严格模式下对尾调用的优化来优化代码，例子：递归
```
function factorial(n) {
  if (n <= 1) {
    return 1
  } else {
    // 不满足优化条件，所以当n很大时，会出现栈溢出
    return n * factorial(n - 1)
  }
}

// 优化代码
function factorial(n, p = 1) {
  if (n <= 1) {
    return 1 * p
  } else {
    let result = n * p
    // optimized
    return factorial(n - 1, result);
  }
}
```

