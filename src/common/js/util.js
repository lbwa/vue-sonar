function getRandomInt (min, max) { // 产生介于 min 和 max 之间的随机数，包含上下限
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) { // 经典打乱数组算法
  let _arr = [...arr]
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
