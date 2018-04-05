export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join('')
}

export function hasClass (el, className) {
  let reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
  return reg.test(el.className)
}

export function getData (el, name, value) {
  const prefix = 'data-'
  name = prefix + name
  if (value) {
    return el.setAttribute(name, value)
  } else {
    return el.getAttribute(name)
  }
}

// 浏览器能力检测，检测当前浏览器需要添加何种前缀

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false // 没有任何已知前缀能被当前浏览器识别时
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false // 没有任何已知前缀能被当前浏览器识别时
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1) // 'webkitTransform'
}
