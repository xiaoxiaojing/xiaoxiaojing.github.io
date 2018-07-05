---
title: ES6：Symbol
date: 2018-07-04 22:13:16
tags: es6
categories: ES6系列
---

## Creating Symbols
1. 声明`Symbol`
```
let symbolVal = Symbol()
```

2. Symbol的描述信息会被存储在内部属性`[[Description]]`上，当调用`toString()`时，会读取这个属性
```
let symbolWithDescription = Symbol('first name')
symbolWithDescription.toString() // 'Symbol(first name)'
```

3. 使用`typeof`判断类型
```
let symbol = Symbol('test symbol')
console.log(typeof symbol)  // 'symbol'
```

## Sharing Symbols
1. `Symbol.for(key)`：创建被共享的Symbol，key相同的Symbol相等
```
let uid1 = Symbol.for('uid')
let uid2 = Symbol.for('uid')
uid1 === uid2 // true
```

2. `Symbol.for(key)`的创建步骤
  * 先搜索`the global symbol registry`
  * 如果注册表中存在标识为`key`的Symbol，则返回这个Symbol。
  * 如果不存在，则创建一个新的Symbol，并将这个Symbol注册到注册表中，其标识为`key`

3. `Symbol.keyFor(Symbol)`：访问`shared Symbol`的`key`

## 获取一个对象的`Symbol`属性
* `Object.getOwnPropertySymbols()`：只获取`Symbol`属性
* `Reflect.ownKeys()`：获取所有的属性，包括`Symbol`属性

## Exposing Internal Operations with Well-known Symbol
1. `Symbol.hasInstance`：可以通过修改`Symbol.hasInstance`改变`instanceof`的默认行为
```
function MyObject() {
    // empty
}
// 必须通过Object.defineProperty去修改Symbol.hasInstance
Object.defineProperty(MyObject, Symbol.hasInstance, {
  value: function(v) {
    return false;
  }
});
let obj = new MyObject();
console.log(obj instanceof MyObject);  // false
```

2. `Symbol.isConcatSpreadable`：当使用`concat(param)`时，用于确定`param`是否应该展开
```
let collection = {
  0: "Hello",
  1: "world",
  length: 2,
  [Symbol.isConcatSpreadable]: true
};
let messages = [ "Hi" ].concat(collection);
console.log(messages.length);    // 3
console.log(messages);  // ["hi","Hello","world"]
```

3. `Symbol.iterator`：返回一个`iterator`
4. `Symbol.species`
5. `Symbol.match`、`Symbol.replace`、`Symbol.search`、`Symbol.split`：创建类似`regular expressions`的对象
6. `Symbol.toPrimitive`：重写类型转化时的默认行为
```
function Temperature(degrees) {
  this.degrees = degrees;
}

Temperature.prototype[Symbol.toPrimitive] = function(hint) {
  switch (hint) {
    case "string":
      return this.degrees + "\u00b0"; // degrees symbol
    case "number":
      return this.degrees;
    case "default":
      return this.degrees + " degrees";
  }
};
var freezing = new Temperature(32);

console.log(freezing + "!");   // "32 degrees!"
console.log(freezing / 2);     // 16
console.log(String(freezing)); // "32°"
```

7. `Symbol.toStringTag`
```
Array.prototype[Symbol.toStringTag] = "Magic";
var values = [];
console.log(Object.prototype.toString.call(values));    // "[object Magic]"
```

8. `Symbol.unscopables`：定义了在`with`声明的作用域里会被排除的属性