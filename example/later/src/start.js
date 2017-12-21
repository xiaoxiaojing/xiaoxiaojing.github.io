const later = require('later')

const sched3 = later.parse.recur().every(5).second()
later.setInterval(function () {
  console.log(new Date())
}, sched3)
