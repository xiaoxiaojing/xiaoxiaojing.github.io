---
title: 我理解的React
date: 2018-01-20 18:34:09
tags: react
categories: REACT
---

## React中的事件
### SyntheticEvent
React基于Virtual DOM实现了SyntheticEvent，它是JavaScript原生事件的一个子集。
与原生事件不同的是，SyntheticEvent是跨浏览器的，使用时无需再考虑兼容性问题。
