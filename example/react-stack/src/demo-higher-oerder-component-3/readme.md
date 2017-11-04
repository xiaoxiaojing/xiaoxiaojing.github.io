# 功能描述
1. 有三个组件
  * Select
  * Search
  * SearchSelect
2. 组件的共同点，都有input 和 list

# 实现
## 组件再分离：尽量分离出纯函数组件
* Select = SelectInput + List
* Search = SearchInput + List
* SearchSelect = SearchInput + SelectInput + List

### List
* props: items, onSelect

### SelectInput
* props: selectItem, onClick

### SearchInput
* props: value, onChange
