// @flow
/*********** Primitive Types *************/
function method (x: number, y: string, z: boolean, a: null, b: void) {
  //...
}
method(3.14, 'hello', true, null, undefined)
// method("3.14", 'hello', true, 123, undefined)

function method2 (x: Number, y: String, z: Boolean) {
  //...
}
// method2(3.14, "hello", true)
method2(new Number(3.14), new String('hello'), new Boolean(true))

/*********** Literal Types *************/
function acceptsTwo (x: 3.14, y: true, z: 'hello') {}
acceptsTwo(3.14, true, 'hello')
// acceptsTwo(3, false, 'world')

/*********** Mixed Types *************/
function method3 (value: mixed) {}
method3(null)
method3(3.14)
function method4 (value: mixed) {
  // return "" + value
  if (typeof value === 'string') {
    return "" + value
  }
  return ""
}
method4('str')

/*********** Any Types *************/
function method5 (value: any) {
  return "" + value
}
method5(12)

/*********** Any Types *************/
function method6 (value: ?number) {
  //...
}
method6(1)
method6(null)
method6(undefined)
// method6('test')

/*********** Variable Types *************/
var varVariable = 1
let letVariable = 1
const constVaribale = 1
varVariable = 2
letVariable = 2
// constVaribale = 2

/*********** Function Types *************/
function method7 (a:string, b:string): string {
  // return 3.14
  return a + b
}

/*********** Object Types *************/
var obj1: {
  foo: number,
  bar: boolean,
  baz: string
} = {
  foo: 1,
  bar: true,
  baz: 'three'
}
// obj.bazz

/*********** Array Types *************/
let arr1: Array<number> = [1,2,3]
let arr2: number[] = [1,2,3]
let arr3: ?Array<number> = null
let arr4: ?number[] = null
let arr5: Array<?number> = [null, 1]
let arr6: (?number)[] = [null, 1]
let value: number = arr1[4]

/*********** Tuple Types *************/
let tuple1: [number, string] = [1, "123"]
let tuple1Value: number = tuple1[0]
// let tuple2: [number] = tuple1
// let tuple3: [number, string] = tuple1
// let tuple4: [number, string, number] = tuple1
// let array: Array<number> = [1]
// let tuple5: [number] = array
tuple1.join(',')
// tuple1.push('2')

/*********** Class Types *************/
class MyClass {
  props: string
  method (value: string): number {
    this.props = value
    return 1
  }
}
let myInstance: MyClass = new MyClass()
console.log(myInstance);

class MyClass1<A, B, C> {
  arg1: A
  constructor(arg1: A, arg2: B, arg3: C) {
    this.arg1 = arg1
  }
}

var val: MyClass1<number, boolean, string> = new MyClass1(1, true, 'three');
console.log(val);

/*********** Types Aliases *************/
type MyObject = {
  foo: number,
  bar: boolean,
  baz: string,
}
var obj: MyObject = {
  foo: 1,
  bar: true,
  baz: 'test'
}

/*********** Union Types *************/
function method8 (value: number|boolean|string) {
  if (typeof value == 'number') {
    return value * 2
  }
}
console.log(method8(true));
// method8({})
/*type response = {
  success: boolean,
  value?: number,
  error?: string
}*/
type success = {success: true, value: number}
type failed = {success: false, error: string}
type response = success | failed
function method9 (response: response) {
  if (response.success) {
    var value: number = response.value
  } else {
    var error: string = response.error
  }
}

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

type test = {
  tag: test,
  name: 1
}
var test1: test = {
  tag: {name:1},
  name: 1
}
