---
title: 《深入React技术栈》学习笔记——React源码
date: 2017-11-11 11:49:33
tags: react
categories: REACT
---

* 源码版本：React 16.1.1

## React项目总览：[项目地址]（https://github.com/facebook/react）
* 使用的构建工具：{% post_link yarn概览 yarn概览 %}
* packages中的modules
  ```
  react
  ```

## `react`源码解读
* 先了解几个常量：[ReactSymbols.js](https://github.com/facebook/react/blob/master/packages/shared/ReactSymbols.js)
  ```
  REACT_ELEMENT_TYPE   //Symbol(react.element)
  ```

### 1.[入口文件](https://github.com/facebook/react/blob/master/packages/react/index.js)
```
var React = require('./src/React');
// 暴露了React实例，使用React.default方便测试
module.exports = React.default ? React.default : React;
```

### 2.[React.js](https://github.com/facebook/react/blob/master/packages/react/src/React.js)
```
// 这个文件是定义一个有各类方法和属性的React对象，从源码中可以看出React有以下属性和方法
{
  Children,
  Component,
  PureComponent,
  unstable_AsyncComponent,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  version,

}
```
### 3.[ReactNoopUpdateQueue.js](https://github.com/facebook/react/blob/v16.1.1/packages/react/src/ReactNoopUpdateQueue.js)
```
// 声明了几个空函数，从这里的命名可以看出React是通过队列来做更新操作的
var ReactNoopUpdateQueue = {
  isMounted: function(publicInstance) {
    return false;
  },
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
  },
  enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
  },
  enqueueSetState: function(publicInstance, partialState, callback, callerName) {
  }
}
```

### 4.[ReactBaseClasses.js](https://github.com/facebook/react/blob/v16.1.1/packages/react/src/ReactBaseClasses.js)
* 返回用于构造组件的几个基类：Component，PureComponent，AsyncComponent
  - 构造Component
  ```
  // 定义Component，有私有的props，context，refs，updater属性
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  // this.state是不可变的，只能通过this.setState来更新
  // 使用this.setState更新state是批量更新，所以调用this.setState后不会马上更新this.state，调用方法后马上访问this.state将会得到旧的state
  Component.prototype.setState = function(partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  ```
  - 构造`PureComponent`(`AsyncComponent`的构造和`PureComponent`同理，🤔？为什么要这样写继承？🤔🤔)
  ```
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;
  var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  Object.assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  ```

* 源码中对`setState`的解释
  - `this.state`应该被认为是不可变的，只能通过`this.setState`来更新
  - 由于使用`this.setState`更新`state`是批量更新，所以调用`this.setState`不会马上更新`this.state`，调用方法后马上访问`this.state`将会得到旧的state

### 5.[ReactChildren.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactChildren.js)
* 几个功能函数
  ```
  getPooledTraverseContext(map, key, func, context) // 汇总上下文
  releaseTraverseContext(traverseContext) // release上下文
  ```
* `forEach`、`map`、`count`、`toArray`都调用了同一个函数：`traverseAllChildrenImpl`  
  - 如果Children为：`undefined`, `boolean`, `string`, `object`（且`$$typeof`为特定值）， 执行callback，并返回1
  - 如果Children为Array：**循环数组** 计算节点数量，**递归** 调用callback
    ```
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext); // 递归时，invokeCallback为真，会调用callback，并返回1
    }
    ```
  - 如果Children为Iterator(即可迭代对象)：**迭代对象** 计算节点数量，**递归** 调用callback

* `React.Children.only`：判断是否只有一个Children
  ```
  function onlyChild(children) {
    invariant(
      isValidElement(children), // 当chidlren.$$typeof为REACT_ELEMENT_TYPE才会为真
      'React.Children.only expected to receive a single React element child.',
    );
    return children;
  }
  ```

### 6.[ReactElement.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js)
* 从源码中可以看到，React的Element的结构
  ```
  var element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  }
  ```
* createElement
  ```

  ```
  createFactory,
  cloneElement,
  isValidElement
* isValidElement, cloneElement, cloneAndReplaceKey, createFactory, createElement










* 源码版本：React 15.0.0

## React源码总览
### 目录结构
<div style="width:460px;">
  {% asset_img react源码目录.jpg %}
</div>

* `addons`：包含一系列的工具方法插件，如`PureRenderMixin`、`CSSTransitionGroup`、`Fragment`、`LinkedStateMixin`等
* `isomoriphic`：包含一系列同构方法
* `shared`：包含一些公用或常用方法，如`Transaction`、`CallbackQueue`等
* `test`：包含一些测试方法等
* `core/tests`：包含一些边界错误的测试用例
* `renderers`：代码的核心部分

#### `renderers`目录结构
* 目录结构如下：
  <div style="width:460px;">
    {% asset_img renderers源码目录.jpg %}
  </div>
* `dom`目录分析
  - `client`：包含DOM操作方法（如：`findDOMnode`、`setInnerHTML`、`setTextContent`等）以及事件方法（`ReactEventListener`、`TapEventPlugin`、`SyntheticEvents`）
  - `server`：主要包含服务端渲染的实现和方法
  - `shared`：包含文本组件（`ReactDOMTextComponent`）、标签组件（`ReactDOMComponent`）、DOM属性操作（`DOMProperty`、`DOMPropertyOperations`）、CSS属性操作（`CSSProperty`、`CSSPropertyOperations`）
* `shared`目录分析
  - `event`：包含一些更为底层的事件方法，如事件插件中心（`EventPluginHub`）、事件注册（`EventPluginRegistry`）、事件传播（`EventPropagators`）以及一些事件通用方法。
  - `reconciler`：协调器，最核心的部分。包含React中自定义组件的实现（`ReactCompositeComponent`）、组件生命周期机制、setState机制（`ReactUpdates`、`ReactUpdateQueue`）、`DOM diff`算法（`ReactMultiChild`）等重要的特性方法。是实现Virtual DOM的主要源码

### Virtual DOM
* Virtual DOM是JavaScript对象
* 基于React开发时， 所有的DOM树都是通过`Virtual DOM`构造的
* `React`在`Virtual DOM`上实现了**DOM diff算法**，当数据更新时，会通过diff寻找需要变更的DOM节点，并只对变化的部分进行实际的浏览器的DOM更新，而不是重新渲染整个DOM树
* `React`也能够实现Virtual DOM的**批处理更新**，当操作Virtual DOM时，不会马上生成真实的DOM，而是会将一个事件循环（`event loop`）内的两次数据更新进行合并，这样就使得React能够在事件循环的结束之前完全不用操作真实的DOM

### React的事件系统
* React自定义了一套通用事件的插件系统，该系统包含事件监听器、事件发射器、事件插件中心、点击事件、进/出事件、简单事件、合成事件以及一些事件方法
  <div style="width:460px;">
    {% asset_img 通用事件插件系统.jpg %}
  </div>

## Virtual DOM模型
* 负责Virtual DOM底层框架的构建工作，它拥有一整套的Virtual DOM标签，并负责虚拟节点及其属性的构建、更新、删除等工作

### 构建虚拟节点
1. DOM标签应该具有的基本元素
  * 标签名
  * 节点属性，包含样式、属性、事件等
  * 子节点
  * 标识id
2. `Virtual DOM`中的节点称为`ReactNode`，分为三种类型：`ReactElement`、`ReactFragment`、`ReactText`。`ReactElement`又分为`ReactComponentElement`和`ReactDOMElement`
3. ReactNode中不同类型节点所需要的基础元素
  ```
  type ReactNode = ReactElement | ReactFragment | ReactText
  type ReactElement = ReactComponentElement | ReactDOMElement
  type ReactDOMElement = {
    type: string,
    props: {
      children: ReactNodeList,
      className: string,
      ...
    },
    key: string | boolean | number | null,
    ref: string | null
  }
  type ReactComponentElement<TProps> = {
    type: ReactClass<TProps>,
    props: TProps,
    key: string | boolean | number | null,
    ref: string | null
  }
  type ReactFragment = Array<ReactNode | ReactEmpty>
  type ReactNodeList = ReactNode | ReactEmpty
  type ReactText = string | number
  type ReactEmpty = null | undefined | boolean
  ```


## 入口文件[React.js](https://github.com/facebook/react/blob/v15.0.0/src/isomorphic/React.js)
```
// 通过ReactElement得到createElement、createFactory、cloneElement方法
var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;
// 创建React对象，这个对象包含了一系列的方法（如：Component）和属性（如：Children）
var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild,
  },
  Component: ReactComponent,
  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,
  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function(mixin) {
    return mixin;
  },
  DOM: ReactDOMFactories,
  version: ReactVersion,
};
module.exports = React;
```

## 创建React元素
### 创建ReactElement：[ReactElement.js](https://github.com/facebook/react/blob/v15.0.0/src/isomorphic/classic/element/ReactElement.js)
1. 可以看到`element`的基本结构如下
  ```
  {
    type,
    key,
    ref,
    props
  }
  ```
2. `ReactElement`上还定义了几个方法：`createElement`、`cloneElement`、`createFactory`
  ```
  // createElement只是做了简单的参数修正，返回一个ReactElement实例对象
  ReactElement.createElement = function(type, config, children) {
    // 初始化参数
    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;
    // 如果config存在，就提取他的属性
    if (config != null) {
      ref = config.ref === undefined ? null : config.ref;
      key = config.key === undefined ? null : '' + config.key;
      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // 复制config里的属性到props（如id、className等）
      for (propName in config) {
        if (config.hasOwnProperty(propName) &&
            !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }
    // 处理children，全部挂载到props的children属性上。如果只有一个参数，直接赋值给children，否则做合并处理
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
    // 如果某个prop为空且存在默认的prop，则将默认prop赋给当前的prop
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    return ReactElement(
      type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  // createFactory：创建了某一类型的ReactElement
  ReactElement.createFactory = function(type) {
    var factory = ReactElement.createElement.bind(null, type);
    factory.type = type;
    return factory;
  };
  // cloneElement
  ReactElement.cloneElement = function(element, config, children) {
    return ReactElement(element.type, key, ref, self, source, owner, props)
  }
  ```

### 创建组件
1. 初始化组件：[instantiateReactComponent.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/instantiateReactComponent.js)
  * 通过判断node类型来区分不同组件的入口
    ```
    function instantiateReactComponent(node) {
      var instance;
      // 如果node为空时，即是【空组件】，就是用ReactEmptyComponent来创建组件实例
      if (node === null || node === false) {
        instance = ReactEmptyComponent.create(instantiateReactComponent);
      } else if (typeof node === 'object') { //如果node的类型对象，即是DOM标签组件或自定义组件
        var element = node;
        if (typeof element.type === 'string') {
          // 如果type是string，则是一个DOM标签组件（ReactDOMComponent）
          instance = ReactNativeComponent.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
          // ???不太懂
          instance = new element.type(element);
        } else {
          // 是自定义组件（ReactCompositeComponent）
          instance = new ReactCompositeComponentWrapper(element);
        }
      } else if (typeof node === 'string' || typeof node === 'number') {
        // 如果node是字符串或数字，则是文本组件（ReactTextComponent）
        instance = ReactNativeComponent.createInstanceForText(node);
      } else {
        //如果是其他情况不做处理
      }
      return instance;
    }
    ```

2. 创建文本组件[ReactDOMTextComponent.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/dom/shared/ReactDOMTextComponent.js)
  ```
  // 这是一个ReactText，而不是ReactElement
  var ReactDOMTextComponent = function(text) {
    // 保存当前字符串
    this._currentElement = text;
    this._stringText = '' + text;
    // ReactDOMComponentTree uses these:
    this._nativeNode = null;
    this._nativeParent = null;
    // Properties
    this._domID = null;
    this._mountIndex = 0;
    this._closingComment = null;
    this._commentNodes = null;
  };

  Object.assign(ReactDOMTextComponent.prototype, {
    mountComponent: function(transaction, nativeParent, nativeContainerInfo, context) {
      var domID = nativeContainerInfo._idCounter++;
      var openingValue = ' react-text: ' + domID + ' ';
      var closingValue = ' /react-text ';
      this._domID = domID;
      this._nativeParent = nativeParent;
      // 如果使用createElement创建文本标签，则该文本会带上标签和domID
      if (transaction.useCreateElement) {
        var ownerDocument = nativeContainerInfo._ownerDocument;
        var openingComment = ownerDocument.createComment(openingValue);
        var closingComment = ownerDocument.createComment(closingValue);
        var lazyTree = DOMLazyTree(ownerDocument.createDocumentFragment());
        // 开始标签
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(openingComment));
        // 如果是文本类型，则创建文本节点
        if (this._stringText) {
          DOMLazyTree.queueChild(
            lazyTree,
            DOMLazyTree(ownerDocument.createTextNode(this._stringText))
          );
        }
        // 结束标签
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(closingComment));
        ReactDOMComponentTree.precacheNode(this, openingComment);
        this._closingComment = closingComment;
        return lazyTree;
      } else {
        var escapedText = escapeTextContentForBrowser(this._stringText);
        // 静态页面下直接返回文本
        if (transaction.renderToStaticMarkup) {
          return escapedText;
        }
        // 如果不是通过createElement创建的文本，则将标签和属性注释掉，直接返回文本内容
        return (
          '<!--' + openingValue + '-->' + escapedText +
          '<!--' + closingValue + '-->'
        );
      }
    },
    // 更新文本内容
    receiveComponent: function(nextText, transaction) {
      if (nextText !== this._currentElement) {
        this._currentElement = nextText;
        var nextStringText = '' + nextText;
        if (nextStringText !== this._stringText) {
          this._stringText = nextStringText;
          var commentNodes = this.getNativeNode();
          DOMChildrenOperations.replaceDelimitedText(
            commentNodes[0],
            commentNodes[1],
            nextStringText
          );
        }
      }
    }
  ```

3. DOM标签组件 [ReactDOMComponent.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/dom/shared/ReactDOMComponent.js)
  * `ReactDOMComponent`方法之间的关系
    <div style="width:460px;">
      {% asset_img 方法之间的关系.jpg %}
    </div>
  * 使用react时，`<div>`并非元素的`<div>`标签，而是React生成的Virtual DOM对象。
  * `ReactDOMComponent`针对Virtual DOM标签的处理主要分为以下两个部分：
    - 属性的更新，包括更新样式、更新属性、处理事件等。
    - 子节点的更新，包括更新内容、更新子节点
  * 更新属性(`_createOpenTagMarkupAndPutListeners`方法)
    ```
    // 处理DOM节点的属性和事件
    _createOpenTagMarkupAndPutListeners: function(transaction, props) {
      var ret = '<' + this._currentElement.type;
      // 拼凑出属性    
      for (var propKey in props) {
        var propValue = props[propKey];
        // 如果存在事件，针对当前的节点添加事件代理
        if (registrationNameModules.hasOwnProperty(propKey)){
          if (propValue) {
            enqueuePutListener(this, propKey, propValue, transaction);
          }
        } else {
          // 如果存在样式，首先对样式进行合并操作，然后创建样式
          if (propKey === STYLE) {
            if (propValue) {
              propValue = this._previousStyleCopy = Object.assign({}, props.style);
            }
            propValue = CSSPropertyOperations.createMarkupForStyles(propValue, this);
          }
          // 创建属性标识
          var markup = null;
          if (this._tag != null && isCustomComponent(this._tag, props)) {
            if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
              markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
            }
          } else {
            markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
          }
          if (markup) {
            ret += ' ' + markup;
          }
        }
      }
      //...
    },
    // 更新节点属性
    _updateDOMProperties: function(lastProps, nextProps, transaction) {
      var propKey;
      var styleName;
      var styleUpdates;
      for (propKey in lastProps) {
        // 当一个旧的属性不在新的属性集合里时，需要删除
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
          continue;
        }
        // 从DOM上删除不需要的样式
        if (propKey === STYLE) {
          var lastStyle = this._previousStyleCopy;
          for (styleName in lastStyle) {
            if (lastStyle.hasOwnProperty(styleName)) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          this._previousStyleCopy = null;
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (lastProps[propKey]) {
            // 这里的事件监听的属性需要去掉监听，针对当前的节点取消事件代理
            deleteListener(this, propKey);
          }
        } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          // 从DOM上删除不需要的属性
          DOMPropertyOperations.deleteValueForProperty(getNode(this), propKey);
        }
      }
      // 对于新属性，需要写到DOM节点上
      for (propKey in nextProps) {
        var nextProp = nextProps[propKey];
        var lastProp =
          propKey === STYLE ? this._previousStyleCopy :
          lastProps != null ? lastProps[propKey] : undefined;
        // 不在新属性中，或与旧属性相同，则跳过
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
          continue;
        }
        // 在DOM上写入新样式（更新样式）
        if (propKey === STYLE) {
          if (nextProp) {
            nextProp = this._previousStyleCopy = Object.assign({}, nextProp);
          } else {
            this._previousStyleCopy = null;
          }
          if (lastProp) {
            // 在旧样式中且不在新样式中，清除该样式
            for (styleName in lastProp) {
              if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = '';
              }
            }
            // 既在旧样式中也在新样式中，且不相同，更新该样式
            for (styleName in nextProp) {
              if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = nextProp[styleName];
              }
            }
          } else {
            // 不存在旧样式，直接写入新样式
            styleUpdates = nextProp;
          }
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (nextProp) {
            // 添加事件监听的属性
            enqueuePutListener(this, propKey, nextProp, transaction);
          } else if (lastProp) {
            deleteListener(this, propKey);
          }
        // 添加新的属性，或更新旧的同名属性
        } else if (isCustomComponent(this._tag, nextProps)) {
          if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
            // setValueForAttribute 更新属性
            DOMPropertyOperations.setValueForAttribute(getNode(this), propKey, nextProp);
          }
        } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          var node = getNode(this);
          if (nextProp != null) {
            DOMPropertyOperations.setValueForProperty(node, propKey, nextProp);
          } else {
            // 如果更新为null或undefined，则执行删除属性操作
            DOMPropertyOperations.deleteValueForProperty(node, propKey);
          }
        }
      }
      // 如果styleUpdates不为空，则设置新样式
      if (styleUpdates) {
        CSSPropertyOperations.setValueForStyles(getNode(this), styleUpdates, this);
      }
    }
    ```
  * 更新子节点
    ```
    // 处理DOM节点的内容
    _createContentMarkup: function(transaction, props, context) {
      var ret = '';
      // 获取子节点渲染出的内容
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML != null) {
        if (innerHTML.__html != null) {
          ret = innerHTML.__html;
        }
      } else {
        var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
        var childrenToUse = contentToUse != null ? null : props.children;
        if (contentToUse != null) {
          // TODO: Validate that text is allowed as a child of this node
          ret = escapeTextContentForBrowser(contentToUse);
        } else if (childrenToUse != null) {
          // 对子节点进行初始化渲染
          var mountImages = this.mountChildren(childrenToUse, transaction, context);
          ret = mountImages.join('');
        }
      }
      // 是否需要换行
      if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
        return '\n' + ret;
      } else {
        return ret;
      }
    },
    // 更新DOM内容和子节点
    _updateDOMChildren: function(lastProps, nextProps, transaction, context) {
      // 初始化
      var lastContent = CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
      var nextContent = CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;
      var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
      var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;
      var lastChildren = lastContent != null ? null : lastProps.children;
      var nextChildren = nextContent != null ? null : nextProps.children;
      var lastHasContentOrHtml = lastContent != null || lastHtml != null;
      var nextHasContentOrHtml = nextContent != null || nextHtml != null;
      // 删除不需要的子节点和内容
      if (lastChildren != null && nextChildren == null) {
        // 如果旧节点存在，而新节点不存在，说明当前节点在更新后被删除了
        this.updateChildren(null, transaction, context);
      } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
        // 如果旧的内容存在，而新的内容不存在，说明当前内容在更新后被删除了
        this.updateTextContent('');
      }
      // 更新子节点和内容
      if (nextContent != null) {
        if (lastContent !== nextContent) {
          // 如果内容变化了，就更新内容
          this.updateTextContent('' + nextContent);
        }
      } else if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          // 更新属性标识
          this.updateMarkup('' + nextHtml);
        }
      } else if (nextChildren != null) {
        // 更新子节点
        this.updateChildren(nextChildren, transaction, context);
      }
    }
    ```

### 自定义组件[ReactCompositeComponent.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactCompositeComponent.js)
* 自定义组件实现了一整套React生命周期和setState机制，因此自定义组件是在生命周期的环境中进行更新属性、内容和子节点的操作。
  <div style="width:460px;">
    {% asset_img ReactCompositeComponent关系.jpg %}
  </div>

## 生命周期
### 特殊概念
1. React的主要思想是通过构建可复用组件来构建用户界面
2. 组件就是有限状态机（FSM），通过状态渲染对于的界面，且每个组件都有自己的生命周期，它规定了组件的状态和方法需要在哪个阶段改变和执行
3. 有限状态机：表示有限个状态以及在这些状态之间的转移和动作等行为的模型，一般通过状态、事件、转换和动作来描述有限状态机。

### 自定义组件的生命周期
1. 3个阶段与对应的方法：`MOUNTING → mountComponent`、`RECEIVE_PROPS → updateComponent`、`UNMOUNTING → unmountComponent`
  - `will`前缀的方法在进入状态之前调用
  - `did`前缀的方法在进入状态之后调用

2. 初始化：`getDefaultProps`：[ReactClass.js](https://github.com/facebook/react/blob/v15.0.0/src/isomorphic/classic/class/ReactClass.js)
  * `createClass`负责管理生命周期中的`getDefaultProps`。该方法在整个生命周期中只执行一次，这样所有实例初始化的props将会被共享
    ```
    var ReactClass = {
      // 创建自定义组件
      createClass: function(spec) {
        var Constructor = function(props, context, updater) {
          // 自动绑定
          if (this.__reactAutoBindPairs.length) {
            bindAutoBindMethods(this);
          }
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
          this.state = null;
          // ReactClass没有构造函数，通过getInitialState和componentWillMount来代替
          var initialState = this.getInitialState ? this.getInitialState() : null;
          this.state = initialState;
        };
        // 原型继承父类
        Constructor.prototype = new ReactClassComponent();
        Constructor.prototype.constructor = Constructor;
        Constructor.prototype.__reactAutoBindPairs = [];
        // 合并mixin
        injectedMixins.forEach(
          mixSpecIntoComponent.bind(null, Constructor)
        );
        mixSpecIntoComponent(Constructor, spec);
        // 初始化defaultProps（可以看到：整个生命周期中，getDefaultProps只执行一次）
        if (Constructor.getDefaultProps) {
          Constructor.defaultProps = Constructor.getDefaultProps();
        }
        for (var methodName in ReactClassInterface) {
          if (!Constructor.prototype[methodName]) {
            Constructor.prototype[methodName] = null;
          }
        }
        return Constructor;
      }
    }
    ```

3. 阶段一： MOUNTING：[ReactCompositeComponent.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactCompositeComponent.js)
  * 这个阶段负责管理生命周期中`getInitialState`、`componentWillMount`、`render`、`componentDidMount`
  * `mountComponent`本质上是通过递归渲染内容，由于递归的特性，父组件的componentWillMount在其子组件的componentWillMount之前调用，而父组件的componentDidMount在其子组件的componentDidMount之后调用
    ```
    // 当组件挂载时， 会分配一个递增编号，表示执行ReactUpdates时更新组件的顺序
    var nextMountID = 1;
    // 初始化组件，渲染标记，注册事件监听器
    mountComponent: function(transaction, nativeParent, nativeContainerInfo, context) {
       // 当前元素对应的上下文
       this._context = context;
       this._mountOrder = nextMountID++;
       this._nativeParent = nativeParent;
       this._nativeContainerInfo = nativeContainerInfo;
       var publicProps = this._processProps(this._currentElement.props);
       var publicContext = this._processContext(context);
       var Component = this._currentElement.type;
       // 初始化公共类
       var inst;
       var renderedElement;
       if (Component.prototype && Component.prototype.isReactComponent) {
         inst = new Component(publicProps, publicContext, ReactUpdateQueue);
       } else {
         inst = Component(publicProps, publicContext, ReactUpdateQueue);
         // 用于判断组件是否为stateless，无状态组件没有状态更新队列，他只专注于渲染
         if (inst == null || inst.render == null) {
           renderedElement = inst;
           warnIfInvalidElement(Component, renderedElement);
           inst = new StatelessComponent(Component);
         }
       }
       // 这些初始化参数应该在构造函数中设置，在此设置是为了便于进行简单的类抽象
       inst.props = publicProps;
       inst.context = publicContext;
       inst.refs = emptyObject;
       inst.updater = ReactUpdateQueue;
       this._instance = inst;
       // 将实例存储为一个引用
       ReactInstanceMap.set(inst, this);
       // 初始化state
       var initialState = inst.state;
       if (initialState === undefined) {
         inst.state = initialState = null;
       }
       // 初始化更新队列
       this._pendingStateQueue = null;
       this._pendingReplaceState = false;
       this._pendingForceUpdate = false;
       var markup;
       if (inst.unstable_handleError) {
         // 如果挂载是出现错误
         markup = this.performInitialMountWithErrorHandling(renderedElement, nativeParent, nativeContainerInfo, transaction, context);
       } else {
         // 无错误，执行初始化挂载
         markup = this.performInitialMount(renderedElement, nativeParent, nativeContainerInfo, transaction, context);
       }
       // 如果存在componentDidMount，则调用
       if (inst.componentDidMount) {
         transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
       }
       return markup;
     },
     // 执行初始化挂载
     performInitialMount: function(renderedElement, nativeParent, nativeContainerInfo, transaction, context) {
       var inst = this._instance;
       if (inst.componentWillMount) {
         inst.componentWillMount();
         // componentWillMount调用setState时，不会触发re-render而是自动提前合并
         if (this._pendingStateQueue) {
           inst.state = this._processPendingState(inst.props, inst.context);
         }
       }
       // 如果不是无状态组件，即可开始渲染
       if (renderedElement === undefined) {
         renderedElement = this._renderValidatedComponent();
       }
       this._renderedNodeType = ReactNodeTypes.getType(renderedElement);
       // 得到 _currentElement对应的component类实例
       this._renderedComponent = this._instantiateReactComponent(renderedElement);
       // render递归渲染
       var markup = ReactReconciler.mountComponent(this._renderedComponent, transaction, nativeParent, nativeContainerInfo, this._processChildContext(context));
       return markup;
     }
    ```

4. 阶段二：RECEIVE_PROPS
  * updateComponent负责管理生命周期中的componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate
5. 阶段三：UNMOUNTING
  * unmountComponent负责管理生命周期中的componentWillUnmount
6. 无状态组件
  * 只有一个render方法
    ```
    // 无状态组件只有一个render函数
    StatelessComponent.prototype.render = function() {
      var Component = ReactInstanceMap.get(this)._currentElement.type;
      // 没有state状态
      var element = Component(this.props, this.context, this.updater);
      warnIfInvalidElement(Component, element);
      return element;
    };
    ```

## setState
* setState通过一个队列机制实现state更新
