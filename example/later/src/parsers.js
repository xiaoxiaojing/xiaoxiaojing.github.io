const later = require('later')
later.date.localTime()

const sched = later.parse.recur().on(2).minute() // 在每个第2分钟的时间
console.log(sched.schedules) // [ { m: [ 2 ] } ]
console.log(sched.exceptions) // []

const sched1 = later.parse.recur().on(2).minute().on(5).second()
console.log(sched1.schedules) // [ { m: [ 2 ], s: [ 5 ] } ]

// 方法
console.log(later.parse.recur().first().minute().schedules)
console.log(later.parse.recur().last().dayOfMonth().schedules)
console.log(later.parse.recur().onWeekend().schedules)
console.log(later.parse.recur().onWeekday().schedules)
console.log(later.parse.recur().every(5).minute().schedules)
console.log(later.parse.recur().after(55).minute().schedules)
console.log(later.parse.recur().before(55).minute().schedules)
console.log(later.parse.recur().every(5).minute().startingOn(10).schedules)
console.log(later.parse.recur().every(5).minute().between(10, 20).schedules)
console.log(later.parse.recur().every(5).minute().between(10, 20)
  .and().every(5).minute().between(10, 20)
  .schedules)
console.log(later.parse.recur().every(5).minute()
  .except().every(5).minute().between(10, 20)
  .schedules, later.parse.recur().every(5).minute()
    .except().every(5).minute().between(10, 20)
    .exceptions)

// Cron
const cron = later.parse.cron('*/5 * * * * *', true)
console.log(cron.schedules)
console.log(later.schedule({schedules: cron.schedules}).isValid(new Date()))

// Text
console.log(later.parse.text('at 10:15 am').schedules)
console.log(later.parse.text('every 5 mins').schedules)
