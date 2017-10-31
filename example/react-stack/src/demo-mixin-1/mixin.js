// 广义的mixin方法：就是用赋值的方法将mixin对象里的方法都挂载到原对象上，来实现对对象的混入。
const Mixin = function(obj, mixins) {
    const newObj = obj
    newObj.prototype = Object.create(obj.prototype)
    for ( let prop in mixins ) {
        if (mixins.hasOwnProperty(prop)) {
            newObj.prototype[prop] = mixins[prop]
        }
    }
    return newObj
}

const BigMixin = {
    fly: () => {
        console.log('I can fly')
    }
}

const Big = function() {
    console.log('new big')
}

// 调用Mixin方法
const FlyBig = Mixin(Big, BigMixin)
const flyBig = new FlyBig()

// 调用flyBig对象上的方法
flyBig.fly()
