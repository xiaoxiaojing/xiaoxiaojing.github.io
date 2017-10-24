---
title: Web网络基础
date: 2017-10-24 11:30:09
tags: http
categories: HTTP
---

## 1. 网络基础TCP/IP
* 通常使用的网络是在TCP/IP协议族的基础上运作的。HTTP（超文本传输协议）是它的一个子集

### TCP/IP的分层管理
* TCP/IP协议族按层次分别是：**应用层、传输层、网络层、链路数据层**

|层次|作用|特点|
|:--|:--|:--|
|应用层|决定了向用户提供应用服务时通信的活动|有HTTP协议<br/>提供了应用服务：FTP，DNS|
|传输层|对上层应用层，提供处于网络连接中的两台计算机之间的数据传输|TCP（Transmission Control Protocol）<br/>UDP（User Data Protocol）|
|网络层|用来处理网络上流动的数据包（数据包是网络传输的最小数据单位）||
|链路层|用来处理连接网络的硬件部分||

<div style="width:600px">
{% asset_img 数据传输.jpg %}
</div>

## 与HTTP关系密切的协议：IP、TCP和DNS
### IP协议：负责传输
* IP协议的作用：把各种数据包传送给对方，（需要确定IP地址和MAC地址）
  - IP地址：指明了节点被分配到的地址
  - MAC地址：指网卡所属的固定地址
  - IP地址和MAC地址可以进行配对，IP地址可变换，MAC地址基本不会更改
* 使用ARP协议（Address Resolution Protocol）凭借MAC地址进行通信
  - ARP：解析地址的协议
  - 通过IP地址可以查出对应的MAC地址
* 路由选择

### TCP协议：确保传输的可靠性
* TCP协议位于传输层，提供可靠的字节流服务（Byte Stream Service）
  - 字节流服务：为了方便传输，将大块数据分割成以报文段（segment）为单位的数据包进行管理
  - 可靠的传输服务：TCP协议能够确认数据最终是否送达到对方
* 三次握手（three-way handshaking）策略
  - flag：SYN（synchronize）、ACK（acknowledgement）
  <div style="width:600px">
  {% asset_img 三次握手.jpg %}
  </div>

### DNS服务：负责域名解析
* DNS服务：位于应用层，提供域名到IP地址之间的解析服务

## 2. URI（Uniform Resource Identifier）和URL（Uniform Resource Locator）
* URI：由某个协议方案表示的资源的定位标识符。协议方案是指访问资源所使用的协议类型名称，如http，ftp，file等
* URL：URL是URI的子集
### URI
<div style="width:600px">
{% asset_img URI的格式.jpg %}
</div>
