const minute = 1000 * 60
const hour = minute * 60
const day = hour * 24

// 计算时间差
// eslint-disable-next-line no-unused-vars
function handleDate (dateTimeStamp) {
  let result
  const now = new Date().getTime()
  const diffValue = now - dateTimeStamp
  if (diffValue < 0) {
    result = '刚刚'
    return result
  }
  const dayC = Math.round(diffValue / day)
  const hourC = Math.round(diffValue / hour)
  const minC = Math.round(diffValue / minute)
  if (dayC > 30) {
    result = format(dateTimeStamp, 'yyyy-MM-dd')
  } else if (dayC > 1) {
    result = dayC + ' 天前'
  } else if (dayC === 1) {
    result = '昨天'
  } else if (hourC >= 1) {
    result = hourC + ' 小时前'
  } else if (minC >= 5) {
    result = minC + ' 分钟前'
  } else { result = '刚刚' }
  return result
}

// 时间格式化
function format (date, format) {
  if (typeof date === 'string') {
    if (date.indexOf('T') >= 0) {
      date = date.replace('T', ' ')
    }
    date = new Date(Date.parse(date.replace(/-/g, '/')))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  const w = [
    ['日', '一', '二', '三', '四', '五', '六'],
    ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  ]
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(w+)/.test(format)) {
    format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()])
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export { handleDate }
