---
title: ES6：字符串和正则表达式
date: 2018-07-02 20:43:24
tags: es6
categories: ES6系列
---

## 几个概念
1. 代码点（Code Point)：Unicode是属于编码字符集（CCS）的范围。Unicode所做的事情就是将我们需要表示的字符表中的每个字符映射成一个数字，这个数字被称为相应字符的码点（code point）。例如“严”字在Unicode中对应的码点是U+0x4E25。

2. 代码单元（Code Unit）：是指一个已编码的文本中具有最短的比特组合的单元。对于UTF-8来说，代码单元是8比特长；对于UTF-16来说，代码单元是16比特长。换一种说法就是UTF-8的是以一个字节为最小单位的，UTF-16是以两个字节为最小单位的。

3. Basic Multilingual Plane（BMP）：一个代码点由一个代码单元组成

4. supplementary planes：一个代码点由多个代码单元组成

## 字符串
在JavaScript中字符串用String类型表示，字符串是由零或多个16位Unicode字符组成的字符序列。

在ES6之前，**每16位Unicode字符**组成的序列，被称为一个`code unit`，所有对字符串的操作（length，charAt）都是对`code unit`来操作的。但是现实是一个`code unit`并不能表示一个字符，比如：双字节字符。

### ES5存在的问题
操作双字节字符会出现问题
```
let text = "𠮷";
console.log(text.length);         // 2
console.log(/^.$/.test(text));    // false
console.log(text.charAt(0));      // �
console.log(text.charAt(1));      // �
console.log(text.charCodeAt(0));  // 55362
console.log(text.charCodeAt(1));  // 57271
```

### ES6中处理字符串的方法
1. `codePointAt(param)`：`param`是code unit position而不是character position
```
let text = "𠮷a";
console.log(text.charCodeAt(0));   // 55362
console.log(text.charCodeAt(1));   // 57271
console.log(text.charCodeAt(2));   // 97

console.log(text.codePointAt(0));  // 134071
console.log(text.codePointAt(1));  // 57271
console.log(text.codePointAt(2));  // 97

// 判断一个字符是否是多字节
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF
}
```

2. `String.fromCodePoint()`
```
console.log(String.fromCodePoint(134071)); // "𠮷"
```

3. `normalize()`

### identify substring
1. `str.indexOf(subStr)`：返回`subStr`首次出现的位置，找不到返回-1
2. `str.includes(subStr, startIndex)`：判断字符串有没有包含`subStr`
3. `str.startsWith(subStr, startIndex)`：判断字符串是否以`subStr`开头
4. `str.endsWith(subStr, length)`：判断字符串是否以`subStr`结尾
5. `str.repeat(number)`：返回`number`个重复的`str`组成的新字符串

## 正则表达式
1. `u`flag：使得正则表达式可以处理多字节字符
```
let text = "𠮷";
console.log(text.length);       // 2
console.log(/^.$/.test(text));  // false
console.log(/^.$/u.test(text)); // true

// 使用u flag来计算字符串的长度
function codePointLength(text) {
    let result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}
console.log(codePointLength("abc"));  // 3
console.log(codePointLength("𠮷bc")); // 3
```

2. `y`flag：[参考文档](http://www.cnblogs.com/ziyunfei/archive/2012/12/07/2807313.html)
  * 会影响正则表达式的`sticky`属性
  * 正则表达式在搜索匹配的字符串时，会根据`lastIndex`开始搜索。如果没有找到，停止搜索。

3. 允许重新定义flag
```
var re1 = /ab/i,
    // throws an error in ES5, okay in ES6
    re2 = new RegExp(re1, "g");  // in ES6, re2 = /ab/g
```

3. 获取正则表达式的source和flag
```
let re = /ab/g;
console.log(re.source);     // "ab"
console.log(re.flags);      // "g"
```

## 模板字面量
### 特征
* Multiline strings
```
let message = `Multiline
               string`;
```

* Basic string formatting
```
let name = "Nicholas",
    message = `Hello, ${name}.`;
```

* HTML escaping
```
let html = `
<div>
    <h1>Title</h1>
</div>`
```

### 模板字面量的标签（tag）
* 定义：A `tag` is simply a function that is called with the processed template literal data
```
function tag(literals, ...substitutions) {
    // return a string
}
```

* 用途：可以根据模板字符串，自定义它的返回值
```
let count = 10,
    price = 0.25,
    message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;

// passthru将接收3个参数
// 第一个参数是：被待替换变量分段的文字字符串数组，['', ' items cost $', '.']
// 其余参数：每个待替换变量的真实值
```

* 默认的标签函数
  * String.raw：返回模板字符串的原始字面量值




