## Flow是什么
* 一个静态类型检查器（static type checker）
* javascript是一门动态类型语言
* 如下代码，对于`add()`的调用者来说，不知道函数内部实现细节。`add(3, '0')`的输出结果就会无法确定。
```
function add (num1, num2) {
  return num1 + num2
}
var x = add(3, '0')
```

## Flow的用法
### 安装（use Yarn+Babel）
```
// 安装babel
yarn add --dev babel-cli babel-preset-flow
// 创建.babelrc
echo '{"presets": ["flow"]}' > .babelrc
// 配置package.json
{
  "scripts": {
    "build": "babel src/ -d lib/",
    "prepublish": "yarn run build"
  }
}
// 安装flow
yarn add --dev flow-bin
```

### 使用
1. 相关命令
```
// 初始化
yarn run flow init
// 检查文件
yarn run flow
```
2. 语法
  * 声明文件：只有添加了 `// @flow`或`/* @flow */`的文件才会被检查

  * 很多情况下Flow可以判断使用的变量的类型，所以不需要特意指明，如下两种写法，如果n是非数字，都会报错
  ```
  // @flow
  function square(n){
    return n*n
  }
  function square(n: number): number {
    return n*n
  }
  ```

## 类型注解（Type Annotations）
### Primitive Types
1. **字面量** 对应的Types是小写的，如：`true`对应的是`boolean`，`null`对应的Types是`null`，`undefined`对应的Types是`void`
```
function method (x: number, y: string, z: boolean, a: null, b: void) {
  //...
}
method(3.14, 'hello', true, null, undefined)  // Works
method("3.14", 'hello', true, 123, undefined) // Error
```

2. **原始包装对象** 对应的Types是大写的，如：`new Boolean(false)`对应的是`Boolean`
```
function method2 (x: Number, y: String, z: Boolean) {
  //...
}
method2(3.14, "hello", true)  //Error
method2(new Number(3.14), new String('hello'), new Boolean(true)) // Works
```

### Literal Types
* 直接使用字面量的值作为Types
* 可以使用的字面量有：Boolean、Number、String
```
function acceptsTwo (x: 3.14, y: true, z: 'hello') {}
acceptsTwo(3.14, true, 'hello') // Works
acceptsTwo(3, false, 'world')   // Error
```

### Mixed Types
* an unknown type，可以是任何类型
```
function method3 (value: mixed) {}
method3(null)   // Works
method3(3.14)   // Works
// 在函数中对输入值做操作，要区分类型，不然会检查不通过
function method4 (value: mixed) {
  // return "" + value  // Error
  if (typeof value === 'string') {  //只对相应类型做操作
    return "" + value  // Works
  }
  return ""
}
```

### Any Types
* 表示不使用类型检查
```
function method5 (value: any) {
  return "" + value   // Works
}
```

### Maybe Types
* `?number`表示：值可以是`number`, `null`, `undefined`
```
function method6 (value: ?number) {
  //...
}
method6(1)         // Works
method6(null)      // Works
method6(undefined) // Works
method6('test')    // Error
```

### Variable Types
* 使用`let`和`var`声明的变量，可以重新赋值
* 使用`const`声明的变量，不可以重新赋值

### Function Types
```
function method7 (a:string, b:string): string {
  // return 3.14  // Error, 函数返回值应该为string
  return a + b
}
```

### Object Types
* 基本语法
```
var obj1: {
  foo: number,
  bar: boolean,
  baz: string
} = {
  foo: 1,
  bar: true,
  baz: 'three'
}
```
* 访问不存在的属性，flow会报错

### Array Types
* 使用`Array<Type>`或`Type[]`创建一个array type，`Type`是数组中元素的类型
```
let arr1: Array<number> = [1,2,3]
let arr2: number[] = [1,2,3]
```
* `?Type[]`与`?Array<Type>`等价
```
let arr3: ?Array<number> = null
let arr4: ?number[] = null
```
* `(?Type)[]`与`Array<?Type>`等价
```
let arr5: Array<?number> = [null, 1]
let arr6: (?number)[] = [null, 1]
```
* 取出数组中的值是undefined时，如下写法是不会报错的
```
let value: number = arr1[4] // Works
```


### Tuple Types
* 语法：使用`[type, type, type]`创建tuples
```
let tuple1: [number, string] = [1, "123"]
```
* 当取出一个值时，这个值的类型是相应index上的type
```
let tuple1Value: number = tuple1[0]    //Works
```
* 不同长度的`Tuple`不能相互赋值，数组和`Tuple`不能互相转化，数组上的方法也不适用于`Tuple`
```
let tuple2: [number] = tuple1   //Error
let tuple3: [number, string] = tuple1  //Works
let tuple4: [number, string, number] = tuple1 //Error
let array: Array<number> = [1]  //Error
let tuple5: [number] = array    //Error
tuple1.join(',')  //Works
tuple1.push('2')  //Error
```

### Class Types
* 可以使用类名作为Type
```
class MyClass {
  // ...
}
let myInstance: MyClass = new MyClass()
```
* 类的方法设置type和函数一样
```
class MyClass {
  method (value: string): number {}
}
```
* 类属性：使用类属性，必须先设置type
```
class MyClass {
  method (value: string): number {
    this.props = value // Error
  }
}
class MyClass {
  props: string
  method (value: string): number {
    this.props = value
  }
}
```
* class generics
```
class MyClass1<A, B, C> {
  constructor(arg1: A, arg2: B, arg3: C) {}
}
var val: MyClass1<number, boolean, string> = new MyClass1(1, true, 'three');
```

### Type Aliases
* 使用Type Aliases来实现：重复使用复杂types
```
type MyObject = {
  // ...
};
var val: MyObject = { /* ... */ };
function method(val: MyObject) { /* ... */ }
class Foo { constructor(val: MyObject) { /* ... */ } }
```

### Union Types
* 定义
```
function method8 (value: number|boolean|string) {
  // ...
}
```
* 在函数中需要根据value的类型来写相应的逻辑
```
function method8 (value: number|boolean|string) {
  if (typeof value == 'number') {
    return value * 2
  }
}
```
* Disjoint Unions
  - 如下写法是有问题的，flow不能更具success知道value和error哪个存在
```
type response = {
  success: boolean,
  value?: number,
  error?: string
}
function method9 (response: response) {
  if (response.success) {
    var value: number = response.value
  } else {
    var error: string = response.error
  }
}
```
  - 将Type改写成如下形式
```
type success = {success: true, value: number}
type failed = {success: false, error: string}
type response = success | failed
```
  - Disjoint unions 要求提供一个可以区分每个Object type的字段，可以写成使用`exact object types`避免添加不必要的属性
```
type success1 = {|success: true, value: number|}
type error = {|error: true, message: string|}
type response2 = success1 | error
function method10 (response: response2) {
  if (response.success) {
    var value: number = response.value
  } else {
    var message: string = response.message
  }
}
```
















1
