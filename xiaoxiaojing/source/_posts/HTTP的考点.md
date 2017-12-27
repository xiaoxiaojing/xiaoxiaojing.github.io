---
title: HTTP的考点
date: 2017-10-24 13:19:08
tags: 面试题
categories: EXAM
---

## 在浏览器的地址栏内输入URL后，发生了什么
1. 简单的过程：Web浏览器通过制定的URL从服务器端获取文件资源（resource）等信息，从而显示出Web页面
2. 图解
<div style="max-width:600px">
{% asset_img 请求过程.jpg %}
</div>

## 什么是REST（Representational State Transfer）？
## Cookie
1. https协议下Cookie是密文传递的
## 为什么不一直使用HTTPS
1. 系统上：
  * 与HTTP相比，HTTPS因为需要进行加密解密处理，会消耗更多的CPU及内存资源。导致负载增加。
  * 与HTTP相比，需要进行SSL通信，使得需要处理的通信量增加
2. 经济上：要进行HTTPS通信，就需要使用证书，证书需要向认证机构购买

## TCP链接
1. TCP三次握手过程，accept发生在三次握手哪个阶段？
  * 第一次握手，客户端发送syn包到服务器
  * 第二次握手，服务器收到syn包，必须确认客户的SYN，同时自己也发送一个ASK包
  * 第三次握手，客户端收到服务器的SYN+ACK包，向服务器发送确认包ACK
  * 三次握手完成后，客户端和服务器建立了TCP链接，这时可以调用accept函数获得此连接
2. 查看TCP连接的命令：netstat

## OSI模型
|层|重点|
|:--|:--|
|应用层||
|表示层||
|会话层||
|传输层||
|网络层|路由器，网关工作在网络层|
|数据链路层|交换机，网桥工作在数据链路层|
|物理层|集线器，中继器工作在物理层|
