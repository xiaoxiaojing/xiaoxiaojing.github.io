---
title: 使用Later.js定义定时任务
date: 2017-12-20 19:29:38
tags: 定时任务
categories: Other
---
* 官方文档：http://bunkat.github.io/later/

## 1.Start：每五秒钟执行一次程序
```
const later = require('later')
const sched3 = later.parse.recur().every(5).second()
later.setInterval(function () {
  console.log(new Date())
}, sched3)
```

* 设置时间所在的区间
```
// set later to use UTC time (the default)
later.date.UTC();
// set later to use local time
later.date.localTime();
```

## 2.Execute：使用later执行定时任务
* later实现了两个方法：`setTimeout`和`setInterval`，这两个方法都会返回一个定时器实例，可以用来清除定时器。
```
t = later.setTimeout(callback, schedule)
t.clear()
later.setInterval(callback, schedule)
```

## 3.Schedules
* 在Later中，Schedules是一个JSON对象
* 可以使用Later的`parsers`生成Schedules
* 一个Schedules有两个属性：`schedules`和`exceptions`
```
// 定义了再每个第20s，25s的schedule，因为定义了exceptions，所以排除了第5s，第10s，第15s
const schedule = {
  schedules:[{s: [5, 10, 15, 20, 25]}],
  exceptions:[{s: [5, 10, 15]}]
}
```

## 4.Parsers
### 1)Recur
* `later.parse.recur()`：用于创建schedules
```
const sched = later.parse.recur().on(2).minute() // 在每个第2分钟的时间
sched.schedules // [ { m: [ 2 ] } ]
sched.exceptions // []
// 链式写法
const sched1 = later.parse.recur().on(2).minute().on(5).second()
console.log(sched1.schedules) // [ { m: [ 2 ], s: [ 5 ] } ]
```
* Recur定义时间段：`Recur`通过以下方法指定各个时间段，方法的意义和`Time periods`中的定义一致
```
second(); minute(); hour(); time();
dayOfWeek(); dayOfWeekCount(); dayOfMonth(); dayOfYear();
weekOfMonth(); weekOfYear();
month(); year();
```
* on(vals)：指定某个或多个时间点
* first()：指定某个时间段中的最小值，如：第0s
* last()：指定某个时间段中的最大值，如：一个月的最后一天
* onWeekend()：指定某一周的星期天
* onWeekday()：指定某一周的不是星期天和星期日的天
* every(vals)：指定一段时间内的某些时间点，如：every(20).minute()，表示第0分，第20分，第40分钟。
* after(val)：表示包括这个时间点之后的所有时间点，如：after(56).minute()，表示第57，58，59分钟
* before(val)：表示包括某个时间点之前的所有时间点
* startingOn(val)：指定开始的时间点，只能在every()后调用
* between(start, end)：指定时间范围，只能在every()后调用
* and()：创建`composite schedule`
* except()：创建`exception schedule`
* customPeriod(id)
* customModifier(id, vals)

### 2)Cron Parser
* later.parse.cron(expr, hasSeconds)：根据cron表达式生成定时器

### 3)Text Parser
* later.parse.text(expr, hasSeconds)：根据自然语言生成定时器

## 5.测试创建的schedules
* 编译schedule：`later.schedule(schedule)`，编译后会得到一个对象，它有如下方法
```
{
  isValid: [Function: isValid],
  next: [Function: next],
  prev: [Function: prev],
  nextRange: [Function: nextRange],
  prevRange: [Function: prevRange]
}
```
### 1)isValid(date)
* 用于判断某个时间是schedules设置的时间点，如果是返回true

### 2)next(count, start, end)/prev
* 计算出schedules表示的某个时间

### 3)nextRange(count, start, end)/preRange
* 计算出一个时间范围：[第一个有效的时间，第一个无效的时间]
