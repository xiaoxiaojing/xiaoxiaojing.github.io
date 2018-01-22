---
title: React原理：diff算法
date: 2017-11-14 20:46:07
tags: react
categories: REACT
---

* `React`将`Virtual DOM`树转换为`actual DOM`树的最少操作的过程称为调和（`reconciliation`）
* `diff`算法就是调和的具体实现

## diff算法的3个策略
1. Web UI中DOM节点跨层级的移动操作特别少，可忽略不计（进行`tree diff`）
2. 拥有相同类型的两个组件将会生成相似的树形结构，拥有不同类型的两个组件将会生成不同的树形结构（进行`component diff`）
3. 对于同一层级的一组子节点，它们可以通过唯一key进行区分（进行`element diff`）

### tree diff
* 两棵树只会对同一层级的节点进行比较。在`tree diff`中只会发生 **创建** 和 **删除** 操作。
* 如下图的节点变化：当A节点（包括其子节点）整个被移到D节点下。React会认为A消失了，就会删除A节点。D节点上多出的A节点，React会认为其是新增节点，创建新的A（包括子节点）。因此尽量不要进行DOM节点跨层级的操作，这样操作会使得节点以及子节点被重新创建，影响性能。
<div style="max-width:460px; border: 1px dotted #ccc">
  {% asset_img DOM层级变换.jpg %}
</div>

### component diff
* 组件间的diff策略
  - 如果是同一类型的组件，按照继续递归比较Virtual DOM树即可（PS：可以通过`shouldComponentUpdate()`来判断组件是否需要进行diff算法分析）
  - 如果不是，则将该组件判断为`dirty component`，删除该节点及其子节点，并重新创建新组件及其子节点
* 如下图的节点变化：当组件D变成了组件G时，会直接删除组件D，重新创建组件G及其子节点。
<div style="max-width:460px; border: 1px dotted #ccc">
  {% asset_img component_diff.jpg %}
</div>

### element diff
* 同一层级一组子节点，会有三种节点操作：INSERT_MARKUP（插入）、MOVE_EXISTING（移动）、REMOVE_NODE（删除）
  - 1）新旧集合中存在相同节点但位置不同（通过节点的`key`来优化如下情况）
    - 未添加key属性时，diff结果：需要删除A，创建B。依次类推，创建并插入A、D、C，删除B、C、D。
    - 添加后，diff结果：B、D不做任何操作，A、C进行移动操作即可
      <div style="max-width:300px; border: 1px dotted #ccc">
        {% asset_img 相同节点位置不同.jpg %}
      </div>
  - 2）新集合中有新加入的节点且就集合存在需要删除的节点：
    <div style="max-width:300px; border: 1px dotted #ccc">
      {% asset_img 节点不同时的创建、移动、删除.jpg %}
    </div>

* 存在的不足：如下图，只需要移动D就可以完成更新，但是按照算法会移动A、B、C
<div style="max-width:300px; border: 1px dotted #ccc">
  {% asset_img 节点更新存在的不足.jpg %}
</div>
