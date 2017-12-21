---
title: HTTP协议基础
date: 2017-10-24 15:30:41
tags: http
categories: HTTP
---
* HTTP协议：超文本传输协议
* HTTP协议用于客户端和服务端之间的通信，请求从客户端发出，最后服务器响应请求并返回
  - **请求报文**：请求方法 + 请求URI + 协议版本 + 可选的请求首部字段 + 内容实体
  - **响应报文**：协议版本 + 状态码 + 用于解释状态码的原因短语 + 可选的响应首部字段 + 实体主体
* HTTP是不保存状态的协议，引入Cookie来实现保存状态的功能
  - Cookie技术通过在请求和响应报文中写入Cookie信息来控制客户端的状态
  <div style="max-width:500px">
  {% asset_img Cookie.jpg %}
  </div>

## 一、HTTP方法
|方法|作用|
|:--|:--|
|GET|获取资源|
|POST|传输实体主体|
|PUT|用来传输文件|
|HEAD|获取报文首部|
|DELETE|删除文件|
|OPTIONS|询问支持的方法|
|TRACE|追踪路径|
|CONNECT|要求用隧道协议连接代理|

## 二、HTTP报文内的HTTP信息
* HTTP报文：HTTP协议交互的信息，是由多行数据构成的字符串文本
  <div style="max-width:460px">
  {% asset_img 报文的结构.jpg %}
  </div>

* HTTP请求报文和响应报文的结构
  <div style="max-width:400px">
  {% asset_img HTTP请求报文.png %}
  {% asset_img HTTP响应报文.png %}
  </div>

### 1.采用MIME（Multipurpose Internet Mail Extensions）机制，处理多个不同类型的数据
  - `multipart/form-data`：请求时使用
    ```
    Content-Type: multipart/form-data
    ```
  - `multipart/byteranges`：状态码206响应报文中使用
    ```
    Content-Type: multipart/byteranges
    ```
### 2.持久连接（HTTP Persistent Connections）
* 字段
  ```
  Connection: keep-alive
  ```
* 特点：只要任意一端没有明确提出断开连接，则保持TCP连接状态
* 优点：减少了TCP连接的重复建立和断开所造成的额外开销，减轻了服务端的负载，可以实现管线化（pipelining）（并行发送多个请求）

### 3.HTTP报文主体和实体主体的差异
* 报文（message）：HTTP通信中的基本单位，由8位组字节流组成，通过HTTP通信传输
* 实体（entity）：作为请求或响应的有效载荷数据被传输，其内容由实体首部和实体主体组成
* 通常，报文主体和实体主体相同，但是当传输过程中进行编码操作时，实体主体的内容发生变化，才导致它的报文主体产生差异
* 对实体主体进行编码提升传输速率
  - 内容编码：压缩传输
  - 分块传输编码：分割发送

### 4.范围请求
* 定义：指定范围发送的请求
* 请求报文
  ```
  //从5001-10000字节
  Range: bytes=5001-10000
  //从5001字节之后全部的
  Range: bytes=5001-
  //从一开始到3000字节和5000-7000字节的多重范围
  Range: bytes=-3000, 5000-7000
  ```
* 响应报文：
  - 返回状态码为`206`的响应报文
  - 多重范围的范围请求，要加上`Content-Type:multipart/byteranges`
  - 服务端无法响应范围请求，则会返回状态码：`200和完整的实体内容`

### 5.内容协商（Content Negotiation）：返回最合适的内容
* 以响应资源的语言、字符集、编码方式等作为判断的基准
* 三种类型：服务器驱动协商（Server-driven Negotiation）、客户端驱动协商（Agent-driven Negotiation）、透明协商（Transparent Negotiation）
* 用到的字段
  ```
  Accept
  Accept-Charset
  Accept-Language
  Accept-Encoding
  ```

## 三、与HTTP协作的Web服务器
* HTTP/1.1规范允许一台HTTP服务器搭建多个Web站点。利用了虚拟主机的功能。

### 1.用于通信数据转发的应用程序（即服务器）：代理、网关、隧道
1). 代理：
  * 基本行为：接收客户端发送的请求后转发给其他服务器，代理不会改变请求URI，会直接发送给前方持有资源的目标服务器（源服务器）。源服务器返回的相应经过代理服务器后再传给客户端
  * 特点：在通信过程中可以级联多台代理服务器
  * 分类：缓存代理，透明代理（不对报文做任何处理）
2). 网关：能使通信线路上的服务器提供非HTTP协议服务
  * 作用：提高通信的安全性
3). 隧道：可以按要求建立一条与其他服务器的通信线路，届时使用SSL等加密手段进行通信
  * 作用：确保客户端能与服务器进行安全的通信

### 2.缓存服务器：是代理服务器的一种
* 缓存
  - 定义：指 **代理服务器** 或者 **客户端本地磁盘** 内保存的资源副本。
  - 作用：利用缓存减少对源服务器的访问，节省了通信流量和通信时间
  - 有效期：判断缓存是否过期，方便更新缓存
  - 请求资源优先级：先查看浏览器缓存，再查看代理服务器的缓存，再请求服务器获取资源

## 拓展：HTTP首部字段
1. 结构：`首部字段名: 字段值[, 字段值]`
2. 示例：`Content-Type: text/html`
3. 分类：
  * 端到端首部（End-to-end Header）
  * 逐跳首部（Hop-by-Hop Header）(除了一下字段，其他都是端到端首部)
    ```
    Connection
    keep-Alive
    Proxy-Authenticate
    Proxy-Authorization
    Trailer
    TE
    Transfer-Encoding
    Upgrade
    ```

### 为Cookie服务的首部字段
|首部字段名|说明|首部类型|
|:---|:---|:---|
|Set-Cookie|开始状态管理所使用的Cookie信息|响应首部字段|
|Cookie|服务器接收到的Cookie信息|请求首部字段|

### Set-Cookie字段的属性
|属性|说明|
|:--|:--|
|NAME=VALUE|赋予Cookie的名称和其值|
|expires=DATE|Cookie的有效期（默认为浏览器关闭前为止）|
|path=PATH|将服务器上的文件目录作为Cookie的适用对象（默认为文档所在的文件目录）|
|domain=域名|作为Cookie适用对象的域名（默认为创建Cookie的服务器的域名）|
|Secure|仅在HTTPS安全通信时才会发送Cookie|
|HttpOnly|加以限制，使Cookie不能被JavaScript脚本访问|
