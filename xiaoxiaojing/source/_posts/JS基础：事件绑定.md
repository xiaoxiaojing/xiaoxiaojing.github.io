---
title: JS基础：事件绑定
date: 2018-01-31 22:34:09
tags: javascript
categories: JavaScript
---

## 封装用于绑定事件的函数
查看：[代码演示](http://jsfiddle.net/07w35vwa/7/)
```js
// 封装一个addListener操作
const dom = {
  addListener (target, eventType, handler) {
    if (target.addEventListener) {
      target.addEventListener(eventType, handler, false)

      return {
        remove: target.removeEventListener.bind(target, eventType, handler, false)
      }
    } else if (target.attachEvent) {
      target.attachEvent(`on${eventType}`, handler, false)

      return {
        remove: target.detachEvent.bind(target, `on${eventType}`, handler, false)
      }
    }
  }
}
```

## EventTarget
EventTarget可以绑定监听器监听事件。
EventTarget有：Element，document，window，XMLHttpRequest等

### EventTarget的方法
#### addEventListener()
（IE中与其对应：attachEvent）
```
// 第三个参数可以是options（Object）或useCapture（boolean）
target.addEventListener(type, listener[, options]);
target.addEventListener(type, listener[, useCapture]);

// options的取值
{
  capture: true|false, // true: 表示事件回调在捕获阶段被触发
  once: true|false,    // true: 监听器被触发一次后会自动移除
  passive: true|false  // true: 用于显示的说明事件回调绝对不会调用preventDefault()
}
```
【对比】
与原生的`dom.onClick`相比：addEventListener可以添加多个listener

【特点】
定义重复的listener（回调函数相同）：只会调用一次，其他重复的会被忽略
```
// 点击div元素时，只会输出一个'test'
const handler = (e) => {
	console.log('test')
}
document.querySelector('div').addEventListener('click', handler, {})
document.querySelector('div').addEventListener('click', handler, {})
```

【拓展】
[移动端Web界面滚动性能优化: Passive event listeners](https://juejin.im/entry/59dd88ec51882578ce26e6c7)

#### removeEventListener
（IE中与其对应：detachEvent）
```
target.removeEventListener(type, listener[, options]);
target.removeEventListener(type, listener[, useCapture]);

// options的取值
{
  capture,
  passive
}
```

#### dispatchEvent
（IE中与其对应：fireEvent）
用于触发一个事件，event可以为内置事件（`click`等），也可以为自定义事件（`new Event('build')`）
可以通过返回值判断该事件是否被取消了，调用`event.preventDefault()`可以取消事件
```
cancelled = !target.dispatchEvent(event)
```

### EventTarget的属性
#### mouseenter与mouseover
相同：mouseenter和mouseover的事件回调都会在鼠标进入元素时触发
不同：mouseenter在捕获阶段被触发，mouseover在冒泡阶段被触发。当鼠标从父元素进入子元素时，mouseenter事件不会冒泡，mouseover的事件会冒泡
（mouseleave和mouseout类似）

---
参考链接
* [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
* [Uses Passive Event Listeners to Improve Scrolling Performance](https://developers.google.cn/web/tools/lighthouse/audits/passive-event-listeners)
