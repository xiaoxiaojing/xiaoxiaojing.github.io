// *********** 创建对象  *********** //
// 字面量方式
var person1 = {
  name: 'YY'
}
// 使用Object()
var person2 = new Object()
person2.name = 'JJ'

// *********** 属性类型：数据属性  *********** //
// 使用defineProperty定义属性，configurable,enumerable,writable默认为false
Object.defineProperty(person1, 'age1', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: 12
})

// writable
Object.defineProperty(person1, 'age2', {
  configurable: true,
  writable: false, // writable为false时，值不能被修改
  enumerable: true,
  value: '12'
})
person1.age1 = 13 // { name: 'YY', age1: '13', age2: '12' }
person1.age2 = 13 // age2的值没有被修改。{ name: 'YY', age1: '13', age2: '12' }

// configurable
Object.defineProperty(person1, 'age3', {
  configurable: false, // configurable: false, // configurable为false时，不能被删除
  writable: true,
  enumerable: true,
  value: '12'
})
delete person1.age3  // 执行后age2没有被删除，{ name: 'YY', age1: '12', age2: '12' }
// 上面的configurable设置为false，不能再次配置属性age3，会报错
// Object.defineProperty(person1, 'age3', {
//   configurable: true
// })

// enumerable
Object.defineProperty(person1, 'age4', {
  configurable: true,
  writable: true,
  enumerable: false, // 不会被枚举
  value: '12'
})

// *********** 属性类型：访问器属性  *********** //
var person3 = {
  _age: 12,
  name: 'XX'
}
Object.defineProperty(person3, 'age', {
  get: function () {
    return this._age
  },
  set: function (age) {
    this._age = age
    this.name = 'BXX'
  }
})
console.log(person3.age) // 12
person3.age = 13 // 将_age的值修改为13，name的值修改为BXX

// 只定义get函数，属性是只读的
Object.defineProperty(person3, 'age1', {
  get: function () {
    return this._age
  }
})
person3.age1 = 14

// 只定义set函数，属性是能写入但是不能被读取的
Object.defineProperty(person3, 'age2', {
  set: function (age) {
    this._age = age
    this.name = 'BXXX'
  }
})
person3.age2 = 15
console.log(person3, person3.age, person3.age1, person3.age2)

// 定义多个属性
var personTJ = {}
Object.defineProperties(personTJ, {
  _age: {
    value: 12,
    writable: true
  },
  name: {
    value: 'TJ',
    enumerable: true,
    writable: true
  },
  age: {
    get: function () {
      return this._age
    },
    set: function (age) {
      this._age = age
      this.name = 'BTJ'
    }
  }
})
personTJ.age = 18
console.log(personTJ, personTJ._age, personTJ.name, personTJ.age)

// 读取属性
console.log(Object.getOwnPropertyDescriptor(personTJ, 'name'))
