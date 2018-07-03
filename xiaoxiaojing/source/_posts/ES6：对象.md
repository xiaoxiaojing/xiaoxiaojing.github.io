---
title: ES6：对象
date: 2018-07-03 22:57:29
tags: es6
categories: ES6系列
---

## Object literal syntax Extensions
1. 简洁的属性初始化（Property Initializer Shorthand）
```
function createPerson (name, age) {
  return {
    name,
    age
  }
}
```

2. 简洁的方法声明（Concise Methods）
```
var person = {
  name: 'xxj',
  sayName () {
    console.log(this.name)
  }
}
```

3. Computed Property Names
```
var suffix = " name";
var person = {
    ["first" + suffix]: "Nicholas",
    ["last" + suffix]: "Zakas"
};
console.log(person["first name"]); // "Nicholas"
console.log(person["last name"]); // "Zakas"
```

## ES6中的New Methods
1. `Object.is()`：用于比较两个值相等（当且仅当类型和值相等时，两个值才相等）
```
// `Object.is()`和`===`的比较结果一致，除了`-0 和 0`、`NaN 和 NaN`
+0 === -0 // true
Object.is(+0, -0) // false

NaN === NaN // false
Object.is(NaN, NaN) // true

Object.is(5, "5") // false
```

2. `Object.assign()`
```
var receiver = {},
  supplier = {
    get name() {
      return "file.js"
    }
  };

// `supplier`的访问器属性会变成`receiver`的数据属性
Object.assign(receiver, supplier);
var descriptor = Object.getOwnPropertyDescriptor(receiver, "name");
console.log(descriptor.value);      // "file.js"
console.log(descriptor.get);        // undefined
```

## 重复的属性声明
在`ES5`的严格模式下，重复的属性声明会报错。`ES6`不会报错，属性的值是最后一个同名属性的值。
```
"use strict";
var person = {
  name: "Nicholas",
  name: "Greg"        // no error in ES6 strict mode
};
console.log(person.name);       // "Greg"
```

## 属性枚举顺序（Property Enumeration Order）
1. 枚举顺序会影响到一些方法的返回值和执行过程
  * Object.getOwnPropertyNames()：返回值按照枚举顺序排序
  * Reflect.ownKeys：返回值按照枚举顺序排序
  * Object.assign()：枚举顺序会影响属性合并的执行顺序

2. 枚举顺序
  * 先枚举`numeric keys`，且所有`numeric keys`按照升序排列
  * 再枚举`string keys`，且所有`string keys`按照添加到对象中的顺序排序
  * 最后枚举`symbol keys`，且所有`symbol keys`按照添加到对象中的顺序排序

> 注：由于不同 JavaScript 引擎对`for-in loop`的实现不一样，所以`for-in, Object.keys(), JSON.stringify()`属性枚举顺序依然不确定

## 操作 Prototypes
* 获取：`Object.getPrototypeOf()`
* 修改：`Object.setPrototypeOf(originObject, changeObject)`，实际上修改的是`[[Prototype]]`的值
* 通过`super`获取当前对象的 prototype：`super.func()`等价于`Object.getPrototypeOf(this).func.call(this)`
  - 没有在简写的对象方法中使用`super`会报错
    ```
    let friend = {
      getGreeting: function(){
        // syntax error
        return super.getGreeting() + ', hi!'
      }
    }
    ```
    
  - 使用`super`实现多级继承（multiple levels of inheritance），防止栈溢出。因为`super`不是动态绑定的，它指向使用 super 的当前对象。
    ```
    // 使用Object.getPrototypeOf，可能会导致栈溢出
    let person = {
      getGreeting() {
        return "Hello";
      }
    };

    let friend = {
      getGreeting() {
        return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
      }
    };
    // prototype is person
    Object.setPrototypeOf(friend, person);

    // prototype is friend
    let relative = Object.create(friend);

    console.log(person.getGreeting()); // "Hello"
    console.log(friend.getGreeting()); // "Hello, hi!"
    console.log(relative.getGreeting()); // Uncaught RangeError: Maximum call stack size exceeded

    // relative的prototype是friend，调用relative.getGreeting时，friend.getGreeting被调用且这时this指向relative。如此返回，直到栈溢出报错
    ```

## method
* 定义：方法是有内部属性`[[HomeObject]]`的函数，该内部属性包含方法所属的对象
* `super`根据`[[HomeObject]]`执行操作
  * 第一步：在`[[HomeObject]]`上调用`Object.getPrototypeOf`方法，获取对象的`prototype`
  * 第二步：在`prototype`上搜索被调用的方法，如：调用`super.func()`就搜索`func`方法
  * 第三步：设置绑定并调用这个方法

