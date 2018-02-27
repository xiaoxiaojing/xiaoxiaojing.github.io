---
title: 《深入浅出Node.js》学习笔记：异步I/O
date: 2018-02-27 09:49:57
tags: NodeJS
categories: NodeJS
---

## 为什么要使用异步I/O
用户体验上：Node是面向网络的，异步I/O耗时少，使得响应速度快

资源分配上：Node使用单线程、异步I/O，避免了其他编程模型中存在的问题
**单线程同步编程模型**
- 优点：易于编程
- 缺点：会因阻塞I/O导致硬件资源得不到更优的使用。（计算机资源中，I/O与CPU计算之间是可以并行进行的，但是同步编程模型，执行耗时的I/O操作，会阻塞CPU计算）

**多线程编程模型**
- 优点：在多核CPU上能有效提升CPU的利用率
- 缺点：创建线程和线程上下文切换开销大、需要处理状态同步和死锁的问题

## 异步I/O和非阻塞I/O
### 非阻塞I/O
操作系统内核对于I/O只有两种方式：阻塞和非阻塞。
- 阻塞I/O：调用后，需要等待I/O完成才返回
- 非阻塞I/O：调用后立即返回

非阻塞I/O通过轮询判断I/O是否完成，轮询的技术有：read、select、poll、epoll、kqueue

### 异步I/O的实现原理
通过让部分线程进行阻塞I/O或非阻塞I/O加轮询技术来完成数据获取，让一个线程进行计算处理，通过线程之间的通信将I/O得到的数据进行传递。如下：
（注意：Node是单线程的，是指JavaScript执行在单线程中，在Node中，内部I/O任务通过线程池来完成。）
<div style="max-width: 400px">
{% asset_img 异步I-O.jpg %}
</div>

## 异步I/O的实现细节
### 基本要素
1. 事件循环（event loop）
2. 观察者
3. 请求对象
4. I/O线程池

### event loop
Node自身的执行模型：event loop（事件循环）
进程启动时，Node会创建一个类似while(true)的循环，每执行一次循环体的过程我们称为`Tick`。执行流程如图所示
<div style="max-width: 400px">
{% asset_img Tick流程图.jpg %}
</div>

### 观察者
在每个Tick的过程中，判断是否有事件需要处理的过程就是向 **观察者** 询问是否有要处理的事件
事件循环是典型的 **生产者/消费者** 模型。异步I/O、网络请求等是事件的生产者，这些事件被传递到对应的观察者那里，事件循环则从观察者那里取出事件并处理。

### 请求对象
请求对象是一个中间量
从JavaScript层传入的参数和当前方法会被封装在请求对象上，请求对象包装完成后会被推到线程池中等待执行

## 异步I/O的执行流程
分为三个部分：
* 异步调用：发起异步调用，封装好请求对象，并将其推入线程池
* 执行I/O操作：I/O操作在线程池中被执行，执行完成后将执行完成的事件传递给I/O观察者
* 执行回调：事件循环从I/O观察者那里取出事件并处理
<div style="max-width: 600px">
{% asset_img 整个异步IO流程.jpg 整个异步I/O流程%}
</div>

## 非I/O的异步API
setTimeout、setInterval、Process.nextTick、setImmediate

### 定时器：setTimeout、setInterval
**实现原理**：和异步I/O类似，但是不需要I/O线程池参与

**执行步骤**：调用setTimeout()或者 setInterval()创建的定时器会被插入到 **定时器观察者** 内部的一个红黑树中。每次Tick执行时，会从该红黑树中迭代取出定时器对象，检查是否超过定时时间，如果超过，就形成一个事件，它的回调函数将立即执行。
<div style="max-width: 600px">
{% asset_img setTimeout执行流程.jpg %}
</div>

**定时器不精确的案例分析**
setTimeout设置一个任务在10ms后执行，在第9ms时，有一个任务占用了5毫秒的CPU时间片，再次轮到定时器执行时，时间已经超过了4ms

### Process.nextTick
**作用**：用于立即异步执行一个任务
**原理**：每次调用process.nextTick()方法，会将回调函数放入队列中，在下一轮Tick时取出执行

**`Process.nextTick`与`setTimeout(functoin(){}, 0)`对比**
  - 相同点：都是用于立即异步执行一个任务
  - 不同点：`Process.nextTick`性能更好，定时器中采用红黑树的操作时间复杂度为O(lg(n))，nextTick()的时间复杂度为O(1)

### setImmediate
**作用**：将回调函数延迟执行
**setImmediate()和process.nextTick()**
* 优先级：process.nextTick的回调函数会先于setImmediate的回调函数执行
* 存储结构：process.nextTick的回调函数保存在数组中，setImmediate的回调函数保存在链表中
* 执行行为？？：process.nextTick在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数
（在新版的Node中，process.nextTick执行完后，会循环遍历setImmediate，将setImmediate都执行完毕后再跳出循环！！！[参考文档](https://segmentfault.com/a/1190000008595101)）

## 拓展
* process.nextTick()属于idle观察者，setImmediate属于check观察者
* 事件循环每一轮循环对观察者的检查是有先后顺序的：idle观察者 > I/O观察者 > ckeck观察者
