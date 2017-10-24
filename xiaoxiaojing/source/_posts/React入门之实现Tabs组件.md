---
title: React入门之实现Tabs组件
date: 2017-09-19 13:59:06
tags:
---
## 效果展示
<div style="width: 250px">
  {% asset_img tab1.png %}
</div>

## 设计思路
1. react的思想是数据驱动，所以将Tabs抽象成一份数据
```
const tabs_data = [
  {label: "tab1", content: 'content1'},
  {label: "tab2", content: 'content2'}
]
```
2. 数据最终渲染成的DOM结构
```
<div class="tabs">
  <ul class="tab">
    <li>tab1</li>
    <li>tab2</li>
  </ul>
  <ul class="tab-content">
    <li>content1</li>
    <li>content2</li>
  </ul>
</div>
```
3. 组件设计
  * 父组件`Tabs`，用来渲染Tabs的结构
    ```
    <div class="tabs">
      <ul class="tab">
        //...
      </ul>
      <ul class="tab-content">
        //...
      </ul>
    </div>
    ```
  * 子组件`Tab`，用来渲染Tabs的nav部分
    ```
    <li>tab1</li>
    ```
  * 子组件`TabContent`，用来渲染Tabs的content部分
    ```
    <li>content1</li>
    ```

## 组件实现
1. 子组件`Tab`和`TabContent`很容易编写，就是一个纯函数（只要注意控制标签的隐藏和显示）
2. 父组件`Tabs`的实现
  * 方法1：将数据`tabs_data`传递给父组件`Tabs`，然后对数据进行处理，构建出子组件。（不直观，如果数据不是需要的格式，还要进行一次数据构造）
  ```
  <Tabs data={tabs_data}></Tabs>
  ```
  * 方法2：在父组件使用阶段，将数据`tabs_data`分解后传送给父组件。（直观，符合React的设计思想）
  ```
  <Tabs>
    <Tab label={tabs_data[0].label}>{tabs_data[0].content}<Tab>
    <Tab label={tabs_data[1].label}>{tabs_data[1].content}<Tab>
  </Tabs>
  ```

3. 父组件的实现
  * 通过Children值构造nav
  ```
  getTabs () {
      return React.Children.map(this.props.children, (item, index)=>{
          return React.cloneElement(item, {
              key: index,
              isChoose: index == this.props.currentIndex,
              children: null,
              onClick: this.props.onChange.bind(null, index)
          })
      })
  }
  ```
  * 通过Children值构造content
  ```
  getContents () {
      return React.Children.map(this.props.children, (item, index)=>{
          return React.createElement(TabContent, {
              key: index,
              isShow: index == this.props.currentIndex,
              children: item.props.children
          })
      })
  }
  ```
  * 组装
  ```
  <div className="ui-tabs">
      <div className="tabs">
          {this.getTabs()}
      </div>
      <div className="contents">
          {this.getContents()}
      </div>
  </div>
  ```
- - -
源代码见：https://github.com/xiaoxiaojing/ToDoDo/tree/master/react/demo/src/Tabs
