// Promise 封装 JSONP
// 简单 JSONP 的实现 https://github.com/webmodules/jsonp
import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 拼接 url
function param (data) {
  let url = ''
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : '' // 检测 key 是否为空，防止向后端传入 undefined
    url += `&${key}=${encodeURIComponent(value)}`
  }
  // String.prototype.substring(indexStart[, indexEnd])
  return url ? url.subString(1) : ''
}
