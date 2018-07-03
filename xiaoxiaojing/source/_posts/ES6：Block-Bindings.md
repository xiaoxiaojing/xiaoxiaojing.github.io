---
title: ES6：Block Bindings
date: 2018-03-13 18:04:38
tags: es6
categories: ES6系列
---

## ES5使用`var`存在的问题
1. 变量提升（Hoisting）：使用var定义变量，无论变量在哪里定义，变量的声明都会被提升到函数的顶部。
```
function getValue(condition) {
  if (condition) {
    var value = "blue";
    return value;
  } else {
    // 'value' exists here with a value of undefined
    return null;
  }
  // 'value' exists here with a value of undefined
}
```

2. 在全局作用域下声明的变量会被添加到全局对象上（如：window），会重写全局对象的同名属性。

## 几个概念
1. 变量（variables）：确切地讲应该成为`bindings`，因为变量的声明应该和某个作用域绑定。
> variables (more formally known as bindings, as a name is bound to a value inside a scope)
2. 块级作用域（block scopes）：也被成为词法作用域（lexical scopes）。

## 块级声明
块级声明（Block-Level Declarations）

块级作用域（block scopes）：也被成为词法作用域（lexical scopes），其通过`{`和`}`创建。

在ES6中通过**块级声明**（`let`，`const`）使得JavaScript具有**块级作用域**。

### `let`
1. 使用let声明的变量具有块级作用域
```
if (true){
	let a = 1
	console.log(a) // 1
} 
console.log(a)   // error: (Uncaught ReferenceError: a is not defined)
```

2. 使用let声明变量，不存在变量提升
```
console.log(a) // error: (Uncaught ReferenceError: a is not defined)
let a = 1

console.log(b) // undefined
var b = 1
```

3. 使用let声明变量，在同一块级作用域中不能重复声明
> let will not redefine an identifier that already exists in the same scope
```
let a = 1
let a = 2 // error: (Uncaught SyntaxError: Identifier 'a' has already been declared)

var b = 1
let b = 2 // error: (Uncaught SyntaxError: Identifier 'a' has already been declared)

var c = 1
if (true) {
  let c = 2  // 2，这时是在新的块级作用域中声明变量
}
```

4. 在全局作用域下使用let声明变量，该变量不会被添加到全局对象上
```
// 使用var
var RegExp = "Hello!";
console.log(window.RegExp === RegExp);  // true

// 使用let
let RegExp = "Hello!";
console.log(window.RegExp === RegExp);  // false
```

### `const`
1. 使用const声明的变量被认为是常量（constants）
2. 使用const声明变量，变量的值一但被设置就不能修改。即每一个通过const声明的变量都必须被设置初始值。
```
const a // error: (Uncaught SyntaxError: Missing initializer in const declaration)
```
3. 使用const声明变量，特征同let一致
4. 使用const声明**对象**，对象的属性是可以修改的
> A const declaration prevents modification of the binding, not of the value.

## TDZ
TDZ：Temporal Dead Zone

通过let和const声明的变量，在声明语言前该变量都是不能被访问的（即使使用`typeof`操作符）。因为，通过let和const声明的变量都放在TDZ。

JavaScript引擎在一个**块级作用域**中查找变量时，任何尝试访问TDZ中的变量的操作都会导致运行时错误（runtime error）
  - 变量通过`var`声明，该变量的声明将会被提升到函数或全局作用域的顶部
  - 变量通过`let`或`const`声明，该变量的声明将会被放置到TDZ（当执行完声明语句后，该变量才会从TDZ中删除）

```
console.log(typeof n)    // 'undefined'
if (true) {
	console.log(typeof n)  // error：（Uncaught ReferenceError: n is not defined）
	let n = 1
}
```

## Block-Binding in Loops
使用let和const声明变量，使得变量在循环语句中具有块级作用域

### 使用var存在的问题
1. 通过`var`声明的变量，会被提升到函数或全局作用域顶部，所以在for循环结束后，该变量仍然可以被访问。并且每次循环访问的i的引用相同（即i被每次循环共享）。
```
var funcs = [];

for (var i = 0; i < 10; i++) {
  funcs.push(function() {
    console.log(i);
  });
}

funcs.forEach(function(func) {
  func();     // outputs the number "10" ten times
});
```

2. 使用**立即执行表达式**（immediately invoked function expressions (IIFEs)）解决以上问题。
```
var funcs = [];

for (var i = 0; i < 10; i++) {
  // i传入立即执行表达式，每个函数都获取了i的一份拷贝并存储在result中
  funcs.push((function(result){
		return function() {
      console.log(result);
    }
	})(i));
}

funcs.forEach(function(func) {
  func();     // outputs 0, then 1, then 2, up to 9
});
```

### 在循环中使用let
使用let声明变量，每次循环时都会创建新的同名变量，并且用当前的值初始化它。所以以下循环的表现和使用了立即执行表达式的循环一致。
```
var funcs = [];

for (let i = 0; i < 10; i++) {
  funcs.push(function() {
    console.log(i);
  });
}

funcs.forEach(function(func) {
  func();     // outputs 0, then 1, then 2, up to 9
})
```

### 在循环中使用const
在正常循环中使用const定义循环变量，会抛出错误：`Uncaught TypeError: Assignment to constant variable.`
```
var funcs = []

// throws an error after one iteration
for (const i = 0; i < 10; i++) {
  funcs.push(function() {
    console.log(i)
  })
}
```

在`for-in`和`for-of`循环中，`const`的表现和`let`一致。

在`for`循环中，初始化语句`const i = 0`执行后，第一次循环正常执行，当执行到`i++`时，是不能修改一个常量的值，所以会报错

在`for-in`和`for-of`循环中，每次循环都会重新创建并初始化循环遍历，所以不会报错

# ES5的几个要点
## 执行环境及作用域
### 执行环境
1. 定义：执行环境定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个执行环境都有一个与之关联的变量对象（variable object），环境中定义的所有变量和函数都保存在这个对象（这个对象代码无法访问，解析器解析代码时会使用到这个对象）中。
2. 全局执行环境：根据ESMAScript实现所在的宿主环境不同，表示执行环境的对象也不一样。在Web浏览器中，全局执行环境被认为是window对象。
3. 局部执行环境：每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

### 作用域链（scope chain）
1. 定义：当代码在一个环境中执行时，会创建变量对象（与执行环境关联的变量对象）的一个作用域链
2. 作用：解析标识符时会沿着作用域链一级一级地搜索标识符
3. 延长作用域链：某些语句可以在作用域链的前端临时增加一个变量对象，改变量对象会在代码执行后被移除。这些语句有：
  - `try-catch`语句的catch块
  - with语句

### js没有块级作用域
* 看一个例子：js在解析下面语句时，if语句中声明的变量会被添加到当前的执行环境中，执行环境只有两类（全局执行和局部执行环境），局部执行环境由函数创建，所以这里color被添加到全局执行环境中，所以可以在if语句外部访问color
```
if (true) {
  var color = 'blue'
}
console.log(color) // blue
```
* 理解for循环：因为js没有块级作用域，所以在for语句中创建的变量i，是保存在循环外部的执行环境中的，for循环结束后，这个变量i仍然可以被访问

## 变量声明和变量提升
### 变量声明
1. 定义：使用var声明的变量会自动被添加到最接近的环境中。如果没有使用var声明，该变量会自动被添加到全局环境中。

### 变量提升（hoisting）
1. 定义：在js引擎预编译时，在某个执行环境中，如函数内。声明变量的操作会被提升到这个函数的顶部，赋值操作在赋值语句原本的位置进行。
```
var scope = 'global'
function f() {
  console.log(scope) // undefined，函数内重新定义了scope，声明会被提前，这时访问scope时，它还没有被赋值
  var scope = 'local' // 在这里才执行赋值操作
  console.log(scope) // local
}
```

---
参考文档
* 《Understanding ECMAScript 6》