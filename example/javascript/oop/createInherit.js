// 原型链
function SuperType () {
  this.property = true
}
SuperType.prototype.getSuperValue = function () {
  return this.property
}
function SubType () {
  this.subProperty = true
}
SubType.prototype = new SuperType()
SubType.prototype.getSubValue = function () {
  return this.subProperty
}
const instance = new SubType()
console.log(instance.getSuperValue())

// 借用构造函数
function SuperType1 () {
  this.color = ['red']
}
function SubType1 () {
  this.subProperty = true
  // 继承了SuperType
  SuperType1.call(this)
}
const instance1 = new SubType1()
instance1.color.push('black')
const instance2 = new SubType1()
console.log(
  instance1,
  instance2
)

// 组合继承
function SuperType2 (name) {
  this.name = name
  this.color = ['red']
}
SuperType2.prototype.sayName = function () {}
function SubType2 (name, age) {
  // 继承了SuperType
  SuperType2.call(this, name)
  this.age = age
}
SubType2.prototype = new SuperType2()
SubType2.prototype.sayAge = function () {}
const instance3 = new SubType2('CC', 12)
console.log(
  instance3,
  SubType2.prototype
)

// 原型式继承
function object (o) {
  function F () {}
  F.prototype = o
  return new F()
}
const person = {
  name: 'AA'
}
const anotherPerson = object(person)
console.log(
  anotherPerson,
  anotherPerson.name
)
const anotherPerson1 = Object.create(person, {
  name: {
    value: 'BB'
  }
})
console.log(anotherPerson1, anotherPerson1.name)

// 寄生式继承
function createAnother (original) {
  var clone = Object.create(original)
  clone.sayHi = function () { console.log('hi') }
  return clone
}
const anotherPerson2 = createAnother(person)
console.log(anotherPerson2, anotherPerson2.name)

// 寄生组合式继承
function inheritPrototype (subType, superType) {
  const prototype = Object.create(superType) // 创建SuperType的副本
  prototype.constructor = subType            // 增强对象
  subType.prototype = prototype              // 指定对象
}
function SuperType3 (name) {
  this.name = name
  this.color = ['red']
}
SuperType3.prototype.sayName = function () {}
function SubType3 (name, age) {
  // 继承了SuperType
  SuperType3.call(this, name)
  this.age = age
}
inheritPrototype(SubType3, SuperType3)
SubType3.prototype.sayAge = function () {}
const instance4 = new SubType2('CC', 12)
console.log(
  instance4,
  SubType3.prototype
)
