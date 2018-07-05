---
title: ES6：解构
date: 2018-07-04 22:09:37
tags: es6
categories: ES6系列
---

## Object Destructuring
```
let node = {
  type: 'Identifier',
  name: 'foo'
}
let {type, name} = node
```

### Destructuring Assignment
注意：必须使用括号包裹`Destructuring Assignment`
```
let node = {
  type: 'Identifier',
  name: 'foo'
},
type = 'Literal',
name = 5

// assign different values using destructuring
({type, name} = node)
```

### Default Values
```
let node = {
  type: 'Identifier'
}

let {type, name, value = true} = node

console.log(type) // 'Identifier'
console.log(name) // undefined
console.log(value) // true
```

### Assigning to Different Local Variable Names
```
let node = {
  type: 'Identifier'
}

let {type: localType, name: nameType = true} = node

console.log(localType)  // 'Identifier'
console.log(nameType)  // true
```

### Nested Object Destructuring
```
let node = {
  type: "Identifier",
  name: "foo",
  loc: {
    start: {
      line: 1,
      column: 1
    },
    end: {
      line: 1,
      column: 4
    }
  }
};


let { loc: { start, end: localEnd }} = node;
```

## Array Destructuring
```
let colors = ['red', 'green', 'blue']
let [firstColor] = colors
let [,,thirdColor] = colors
```
(Default Value 和 Nested Array Destructuring和对象的一致)

### Destructuring Assignment
可以不使用括号包裹`Destructuring Assignment`
```
let colors = ['red', 'green', 'blue'],
    firstColor = 'black',
    secondColor = 'purple'

[firstColor, secondColor] = colors
```

注意：可以用来交换两个变量的值
```
let a = 1, b = 2
[a, b] = [b, a]
```

### Rest Items
```
let colors = ['red', 'green', 'blue']
let [first, ...restColors] = colors

console.log(first)  // 'red'
console.log(resColors) // ['green', 'blue']
```