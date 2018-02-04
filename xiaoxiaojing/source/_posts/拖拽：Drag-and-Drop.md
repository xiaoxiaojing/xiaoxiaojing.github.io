---
title: 拖拽：Drag and Drop
date: 2018-01-30 10:22:33
tags: HTML
categories: HTML
---

## 一个🌰
{% jsfiddle o32atkc3 result %}

### 定义draggable元素
只需要设置元素的`draggable`属性为`true`，该元素就变成了**可拖拽的元素**
```
<div draggable="true">drag</div>
```

### 定义drag事件
```
dom.addListener(dragEle, 'dragstart', (event) => {
  // 定义drag's data
  event.dataTransfer.setData('text/plain', event.target.id)
  // 定义drag image
  event.dataTransfer.setDragImage(img, 10, 10)
  // 定义drop Effect
  event.dataTransfer.dropEffect = 'copy'
})
```

### 定义droppable元素
给一个元素定义`dragover`事件，并阻止其默认行为，就可以将该元素变成droppable元素
```
<div id='dropEle'></div>
dom.addListener(dropEle, 'dragover', (event) => {
  event.preventDefault()
})
```

### 定义drop事件
```
dom.addListener(dropEle, 'drop', (event) => {
  const dragEleId = event.dataTransfer.getData('text/plain')
  event.target.appendChild(document.querySelector(`#${dragEleId}`))
})
```

## DragEvent
DragEvent继承自MouseEvent和Event

### Event type
**Event type有**：drag | dragend | dragenter | dragexit | dragleave | dragover | dragstart | drop
**应该绑定在drag元素上的Event type有**：drag | dragend | dragstart
**应该绑定在drop元素上的Event type有**：dragenter | dragexit | dragleave | dragover | drop
**事件触发顺序为**：dragstart → dragenter → dragover → (drop|dragleave) → dropend

[示例代码](https://jsfiddle.net/zxLv6ewb/)

## DataTransfer
`DragEvent.dataTransfer`：是一个DataTransfer对象，用于设置拖拽数据

### 属性
1. DataTransfer.dropEffect：
  - 取值：none | copy | move | link
2. DataTransfer.effectAllowed：在dragstart中定义，用于说明被允许的effect
  - 取值：none | copy | copyLink | copyMove | link | linkMove | move | all | uninitialized

【注】[dropEffect和effectAllowed的关系](https://codepen.io/SitePoint/pen/epQPNP/)

### 方法
1. DataTransfer.clearData()
2. DataTransfer.getData()
3. DataTransfer.setData()
4. DataTransfer.setDragImage()

## Drag data types
1. 数据为纯文本：
  - 设置数据：event.dataTransfer.setData('text/plain')
  - 获取数据：event.dataTransfer.getData('text')
2. 数据为链接：
  - 设置数据：event.dataTransfer.setData('text/uri-list', url)
  - 获取数据：event.dataTransfer.getData('url')
3. 数据为html
  - 设置数据：event.dataTransfer.setData('text/html', html)
  - 获取数据：event.dataTransfer.getData('text/html')
