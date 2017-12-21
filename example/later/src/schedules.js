const later = require('later')
later.date.localTime()

const sched = {
  schedules: [{s: [0, 5, 30, 45]}]
}
const t = later.setInterval(function () {
  console.log(new Date())
}, sched)
t.clear()

const sched1 = {
  schedules: [{s: [5, 10, 15, 20, 25]}]
}
later.setInterval(function () {
  console.log(new Date())
}, sched1)
