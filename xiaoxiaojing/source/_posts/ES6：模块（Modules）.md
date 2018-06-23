---
title: ES6：模块（Modules）
date: 2018-03-02 10:26:07
tags: es6
categories: ES6系列
---

在ES6之前，一个应用的所有js文件中的代码共享同一个作用域。当应用变得复杂后，会有命名冲突（naming collisions）和安全问题（security concerns）
在ES6中，通过Modules封装代码（Encapsulating code with Modules）

## module的特征
模块中的变量不会自动添加到全局作用域中，模块中的变量只存在于该模块内
模块可以通过`export`导出特定变量和方法
模块可以通过`import`导入其他模块
模块的`this`的值为`undefined`
模块不允许有`HTML-style`注释

## Exporting
可以在任何变量，函数，class声明前添加关键字`export`将其从模块中暴露出去
```js
// export data
export let name = 'TJ'

// export function
export function sum () {}

// export class
export class TJ {}

// export default function
export default function () {}
```

## Importing
可以通过关键字`import`导入其他模块导出的变量和方法。
在一个文件中导入同一个模块多次，该模块只会执行一次（执行一次后将会被保存在内存中）
```js
// 导入一个Binding
import {sum} from './index.js'

// 导入多个Bindings
import {name, sum} from './index.js'

// 导入全部
import * as example from './index.js'
```

> **注意：被导入Bindings的一个怪异行为**
正常情况：使用import声明的变量和方法都是只读的
怪异情况：如果在被导入模块中，修改其导出的变量，在当前模块中的变量是会被修改的

```
// index1.js
export var name = "Nicholas";
export function setName(newName) {
    name = newName;
}

// index2.js
import { name, setName } from "./index1.js";
console.log(name); // "Nicholas"
setName("Greg");
console.log(name); // "Greg"
name = "Nicholas"; // throws an error
```

## 重命名export和import
```
// export
function sum(num1, num2) {
   return num1 + num2;
}
export { sum as add };

// import
import {add as sum} from './example.js'
```

## export/import的特殊用法
```
// export默认值
export default function(num1, num2) {
    return num1 + num2;
}

// import默认值
import sum from "./example.js";

// 导出该模块导入的值
export { sum } from "./example.js";

// 模块可以没有export和import，可以使用简单的import去执行这个模块
import "./example.js";
```

## 加载模块
ES6只定义了module的语法，没有定义如何加载模块

### 在浏览器中使用Modules
通过script引入模块文件
```
<!-- load a module JavaScript file -->
<script type="module" src="module.js"></script>
```

通过script包含行内模块
```
<!-- include a module inline -->
<script type="module">
import { sum } from "./example.js";
let result = sum(1, 2);
</script>

// 在目前版本的chrome中会报错
Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
```

使用script加载的模块的执行顺序和他们在HTML文档中的顺序一致

### 模块标识
在浏览器中加载模块，模块的标识有这些格式：`/`，`./`，`../`以及完整的URL

---
参考文档
* 《Understanding ECMAScript 6》
