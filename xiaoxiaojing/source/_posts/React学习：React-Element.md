---
title: React学习：React Element
date: 2018-01-17 20:40:13
tags: react
categories: REACT
---

## React Element
React Element是React中最小的单位，它是一个简单的对象（plain object）。可以通过React Component创建React Element。
React Element是不可变的（Immutable）
React Element的Symbol是：`Symbol.for('react.element')`

## 源码解读： [ReactElement.js](https://github.com/facebook/react/blob/v16.2.0/packages/react/src/ReactElement.js)
定义了一个工厂函数，用于创建ReactElement
```
var ReactElement = function(type, key, ref, self, source, owner, props) {
  var element = {
    // element的标识
    $$typeof: REACT_ELEMENT_TYPE,

    // 内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 用于记录创建这个element的组件
    _owner: owner,
  };
  return element;
}
```

### createElement(type, config, children)
type的值可以是：**a tag name string**, **a React component type**, **a React fragment type**。示例如下：
```
import React from 'react'
function ChildrenElement (props) {
  return React.createElement('h2', props, props.children)
}
ChildrenElement.defaultProps = {
  style: {color: 'blue'}
}
export default function CreateElement () {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', {style: {color: 'red'}}, 'tag'),
    React.createElement(ChildrenElement, null, 'component'),
    React.createElement(ChildrenElement, {style: {color: 'red'}}, 'component with props'),
    React.createElement(React.Fragment, null, 'React.Fragment')
  )
}
```
可以通过config设置props的值，config上的属性会覆盖type的defaultProps。props上不会有内置属性：key、ref等
```
var propName;
var props = {};

if (config != null) {
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)  // 判断propName是不是内置属性
    ) {
      props[propName] = config[propName];
    }
  }
}

// 属性propName不存在时，才使用defaultProps的propsName的值
if (type && type.defaultProps) {
  var defaultProps = type.defaultProps;
  for (propName in defaultProps) {
    if (props[propName] === undefined) {
      props[propName] = defaultProps[propName];
    }
  }
}
```
createElement可以接收3个或更多参数。除了type和config，其他的参数都会作为children。如下`props.children`的值可以是 **单个element**，也可以是 **element数组**
```
var childrenLength = arguments.length - 2;
if (childrenLength === 1) {
  props.children = children;
} else if (childrenLength > 1) {
  var childArray = Array(childrenLength);
  for (var i = 0; i < childrenLength; i++) {
    childArray[i] = arguments[i + 2];
  }
  props.children = childArray;
}
```
可以通过config设置element的属性：key、ref
```
if (config != null) {
  if (hasValidRef(config)) {
    ref = config.ref;
  }
  if (hasValidKey(config)) {
    key = '' + config.key;
  }
}
```

### cloneElement(element, config, children)
等价于`<element.type {...element.props} {...props}>{children}</element.type>`
可以通过config重写key、ref。当重写ref后，要修改_owner
```
var key = element.key;
var ref = element.ref;
var owner = element._owner;

if (config != null) {
  if (hasValidRef(config)) {
    ref = config.ref;
    owner = ReactCurrentOwner.current;
  }
  if (hasValidKey(config)) {
    key = '' + config.key;
  }
}
```

### isValidElement(object)
ReactElement是一个简单对象，并且它的symbol是`Symbol.for('react.element')`
```
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```
