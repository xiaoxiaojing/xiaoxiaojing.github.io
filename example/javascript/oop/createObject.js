// 工厂模式
function createPerson (name, age) {
  var o = new Object()
  o.name = name
  o.age = age
  o.sayName = function () {
    console.log(o.name)
  }
  return o
}
var person1 = createPerson('TT', 12) // {name: 'TT', age: 12, sayName: [Function]}
var person2 = createPerson('JJ', 13) // {name: 'JJ', age: 12, sayName: [Function]}
console.log(
  person1,
  person2,
  person1.sayName,
  person1.sayName === person2.sayName,
  typeof person1,
  typeof person2
)

// 构造函数
function Person (name, age) {
  this.name = name
  this.age = age
  this.sayName = function () {
    console.log(this.name)
  }
}
var person3 = new Person('CC', 12)
var person4 = new Person('MM', 12)
console.log(
  person3,
  person4,
  person3.constructor === Person,
  person4 instanceof Object,
  person4 instanceof Person,
  person3.sayName === person4.sayName
)

// 原型模式
function Person2 () {
}
Person2.prototype.name = 'FF'
Person2.prototype.age = 12
Person2.prototype.friends = ['AA', 'BB']
Person2.prototype.sayName = function () {
  console.log(this.name)
}
var person6 = new Person2()
var person7 = new Person2()
person7.name = 'CC'
person7.friends.push('CC')
console.log(
  person6,
  person7,
  person6.name,
  person7.name,
  person6.sayName === person7.sayName,
  person6.friends
)

// 组合使用构造函数模式和原型模式
function Person3 (name, age) {
  this.name = name
  this.age = age
}
Person3.prototype.sayName = function () {
  console.log(this.name)
}
const person8 = new Person3('KK', 12)
console.log(person8)

// 动态原型模式
function Person4 (name, age) {
  this.name = name
  this.age = age
  if (typeof this.sayName !== 'function') {
    Person.prototype.sayName = function () {}
  }
}
const person9 = new Person4('HH', 12)
console.log(person9)

// 寄生构造函数模式
function Person5 (name, age) {
  var o = new Object()
  o.name = name
  o.age = age
  o.sayName = function () {}
  return o
}
var person10 = new Person5('MM', 12)
var person11 = new Person5('NN', 12)
console.log(
  person10,
  person11,
  person10 instanceof Person5,
  person10.sayName === person11.sayName
)

// 稳妥构造函数模式
function Person6 (name, age) {
  var o = new Object()
  // 定义私有变量或函数
  var money = 100000
  // 暴露出去的方法不引用this
  o.sayName = function () {
    console.log(name)
  }
  return o
}
const person12 = Person6('XX', 12)
person12.sayName()
console.log(person12)
