---
title: HTTP协议进阶
date: 2017-10-25 19:09:44
tags: http
categories: HTTP系列
---

* HTTP的缺点
  1. 通信使用明文（不加密），内容可能会被窃听
    * HTTP本身不具备加密的功能
    * 加密处理防止被窃听
      - 通信的加密：HTTP协议中没有加密机智，通过和SSL或TLS的组合使用，加密HTTP的通信内容（与SSL组合使用的HTTP被称为HTTPS）
      - 内容的加密：加密报文主体
  2. 不验证通信方的身份，因此有可能遭遇伪装
  3. 无法证明报文的完整性，所以有可能已遭篡改
    * 确认报文完整性的方法：MD5和SHA-1等散列值校验的方法，以及用来确认文件的数字签名方法。
* 针对HTTP的缺点有以下解决方案，如下：

## 一、HTTPS（HTTP Secure）= HTTP + 加密 + 认证 + 完整性保护
* HTTPS：
  - 不是新的协议，只是HTTP通信接口部分用SSL（Secure Socket Layer）和TLS（Transport Layer Security）协议代替
* HTTP和HTTPS的通信方式的区别：
  - HTTP是直接和TCP通信
  - HTTPS使用了SSL，HTTP先和SSL通信，再由SSL与TCP通信
* 加密方式：
  - HTTPS采用了共享密钥加密和公开密钥加密的混合加密机制
* 缺点：使用了SSL，处理速度会变慢。SSL的慢分为两种：
  - 大量消耗CPU和内存等资源，导致处理速度变慢（HTTPS需要做服务器、客户端双方加密及解密处理，因此会消耗CPU和内存等硬件资源）
  - 通信慢（SSL通信部分消耗网络资源；SSL通信部分需要对通信进行处理所以时间上又延长了）

### 1.HTTPS通信步骤
<div style="max-width:600px">
{% asset_img HTTPS请求步骤.jpg %}
</div>

### 2.加密方式
* 共享秘钥加密方式：加密和解密使用同一个密钥
  - 需要发送密钥，可能会被攻击者盗走密钥
* 公开密钥加密方式：发送密文的一方（加密方）使用对方的公开密钥进行加密处理，对方收到密文后，使用自己的私有密钥进行解密。
  - SSL采用了这种加密方式

### 3.认证
* 可以用于认证的信息：密码、动态令牌、数字证书、生物认证、IC卡等
* HTTP使用的认证方式：
  - BASIC认证（基本认证）
  - DIGEST认证（摘要认证）
  - SSL客户端认证
  - FormBase认证（基于表单认证）

#### 1）BASIC认证
1. 步骤：
  <div style="max-width:500px">
  {% asset_img basic认证.jpg %}
  </div>
2. 缺点：
  * 虽然采用Base64编码方式，但不是加密处理。不需要任何附加信息即可对其解码
  * 想再进行一次BASIC认证时，一般的浏览器无法实现认证注销操作

#### 2）DIGEST认证
1. 特点：采用质询/响应的方式（challenge/response)
  <div style="max-width:500px">
  {% asset_img 质询/响应.jpg %}
  </div>
2. 步骤
  <div style="max-width:500px">
  {% asset_img DIGEST认证.jpg %}
  </div>

#### 3）SSL客户端认证
1. 特点
  * 采用双因素认证：证书认证 + 表单认证
2. 步骤
  * 接收到需要认证资源的请求，服务器会发送Certificate Request报文，要求客户端提供客户端证书
  * 用户选择将发送的客户端证书后，客户端会把客户端证书信息以Client Certificate报文方式发送给服务器
  * 服务器验证客户端证书，验证通过后方可领取证书内客户端的公开密钥，然后开始HTTPS加密通信

#### 4）基于表单的认证（最常用的认证方式）
1. 定义：基于表单的认证时通过服务器端的Web应用，将客户端发送过来的用户ID和密码与之前登录过的信息做匹配来进行认证的
2. 特点：使用了Cookie来管理Session（会话）
3. 步骤：
  <div style="max-width:500px">
  {% asset_img 基于表单的认证.jpg %}
  </div>

## 以下HTTP标准会变成瓶颈
1. 一条连接上只可发送一个请求
2. 请求只能从客户端开始。客户端不可以接收除响应以外的指令。
3. 请求/响应首部未经压缩就发送。首部信息越多延迟越大
4. 发送冗长的首部。每次互相发送相同的首部造成的浪费越多
5. 可任意选择数据压缩格式。非强制压缩发送

## 解决方案
### 1.Ajax方案（Asynchronous JavaScript and XML）
1. 特点：局部更新
2. 核心技术：`XMLHTTPRequest`
3. 缺点：利用Ajax实时地从服务器获取内容，有可能会导致大量的请求产生

### 2.Comet的解决方法
1. 方案：服务端有内容更新，直接给客户端返回响应
2. 技术：通过延迟应答，模拟实现服务器端向客户端推送（Server Push）的功能
  - 延迟应答：当接收到请求后，处理完毕后不会直接返回响应，会将响应置于挂起状态
3. 缺点：维持连接会消耗更多的资源

### 3.WebSocket
1. 概念：Web浏览器与Web服务器之间全双工通信标准
2. 特点：客户端发起连接，建立WebSocket通信连接后，不论是服务器还是客户端，都可以直接向对方发送报文
  - 推送功能
  - 减少通信量：与HTTP相比，连接时的总开销减少；由于WebSocket的首部信息很小，通行量也相应减少了。
3. 实现WebSocket通信，在HTTP连接建立后，需要完成一次“握手”（Handshaking）的步骤

  <div style="max-width:600px">
  {% asset_img WebSocket通信步骤.jpg %}
  </div>

  - 握手·请求：
    <div style="max-width:600px">
    {% asset_img 建立WebSocket的请求.jpg %}
    </div>
  - 握手·响应：返回状态码`101 Switching Protocols`的响应
    ```
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLAHFOUQWjfaosQWEH=  //这个字段由请求的Sec-WebSocket-Key字段生成
    Sec-WebSocket-Protocal: chat
    ```

### 4.SPDY
1. SPDY以会话层的形式加入，控制对数据的流动，但还是采用HTTP简历通信连接

## HTTP/2.0
* HTTP/2.0围绕着7项技术进行讨论
  <div style="max-width:600px">
  {% asset_img 七项技术.jpg %}
  </div>
