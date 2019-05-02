const formatTime = time => {
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
