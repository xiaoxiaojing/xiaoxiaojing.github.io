---
title: HTTP的考点
date: 2017-10-24 13:19:08
tags:
categories: EXAM
---

## 在浏览器的地址栏内输入URL后，发生了什么
1. 简单的过程：Web浏览器通过制定的URL从服务器端获取文件资源（resource）等信息，从而显示出Web页面
2. 图解
<div style="width:600px">
{% asset_img 请求过程.jpg %}
</div>

## 什么是REST（Representational State Transfer）？
## Cookie
## 为什么不一直使用HTTPS
1. 系统上：
  * 与HTTP相比，HTTPS因为需要进行加密解密处理，会消耗更多的CPU及内存资源。导致负载增加。
  * 与HTTP相比，需要进行SSL通信，使得需要处理的通信量增加
2. 经济上：要进行HTTPS通信，就需要使用证书，证书需要向认证机构购买
