---
title: ES6：Sets and Maps
date: 2018-07-04 22:34:04
tags: es6
categories: ES6系列
---

## Sets
定义：没有重复值的集合

### 创建
通过`new Set(param)`创建Set集合，其中`param`可以是任意的可迭代对象
```
// 创建一个空的集合
var set = new Set()

// 通过数组创建集合
var set = new Set([1, 2, 3, 3])
```

### 属性和方法
1. 获取集合大小：`set.size`
2. 添加一项：`set.add(item)`
3. 删除一项：`set.delete(item)`
4. 删除全部：`set.clear()`
5. 判断是否含有某个值：`set.has(item)`，返回`true/false`
6. 遍历：`set.forEach(callback)`，callback的参数依次是：`(value, key, set)`，其中`value`等于`key`

### 转化为Array
使用`...`将Set转化为Array
```
let set = new Set([1, 2, 3, 3, 2])
let array = [...set] //[1,2,3]
```

### Weak Sets
1. 创建：`new WeakSet(param)`，`param`必须是`object`或者元素仅仅是`object`的数组

2. 区别
  * `Strong Set`：它会存储对象的引用，导致对象不能进行垃圾处理释放内存。
  * `Weak Set`
    - 只会存储`weak object references`，不会妨碍垃圾收集。
    - `add`/`delete`/`has`方法的参数只能是对象
    - 不能被迭代，所以没有`forEach`方法，也没有`size`属性，也不能通过`...`转化为数组

## Maps
定义：key/value的集合
创建：通过`new Map()`创建Map集合
```
// 创建一个空集合
let map = new Map()

// 创建一个有值的集合，用于初始化的值必须是如下形式
let map = new Map([['name', 'tj'], ['age', 25]])
map.has('name') // true
map.get('age') // 25
```

key值：Map的key值可以是对象
```
let map = new Map(),
    key1 = {},
    key2 = {};
map.set(key1, 5);
map.set(key2, 42);
console.log(map.get(key1)); // 5
console.log(map.get(key2)); // 42
```
  
### 属性和方法
1. 获取集合中键值对的个数：`map.size`
2. 判断是否含有某一项：`map.has(key)`
3. 删除某一项：`map.delete(key)`
4. 删除所有：`map.clear()`
5. 添加或修改某一项：`map.set(key, value)`
6. 获取某一项的值：`map.get(key)`
7. 遍历：`map.forEach(callback)`，callback的参数依次是：`(value, key, set)`

### Weak Maps
WeakMaps 是一种存储`weak object references`的方式，特性和WeakSet一致
```
// 用途1：定义私有数据

// 使用立即执行函数（IIFE）来定义私有数据：privateData
let Person = (function() {
  let privateData = new WeakMap();
  function Person(name) {
    privateData.set(this, { name: name });
  }

  Person.prototype.getName = function() {
      return privateData.get(this).name;
  };
  return Person;
}());
```
