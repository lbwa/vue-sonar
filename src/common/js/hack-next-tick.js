// hack for global nextTick
// https://github.com/DDFE/DDFE-blog/issues/24
function noop () {
}

window.MessageChannel = noop
window.setImmediate = noop
