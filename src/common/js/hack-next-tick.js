// hack for global nextTick
// 解决 ios 不能播放的问题（ios 网页播放需要用户交互）
// https://github.com/DDFE/DDFE-blog/issues/24
function noop () {
}

window.MessageChannel = noop
window.setImmediate = noop
