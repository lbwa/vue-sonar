import jsonp from 'common/js/jsonp'
import { HOTKEY_URL, commonParams, options } from './config'

export function getHotKey () {
  const data = {
    ...commonParams,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  }

  return jsonp(HOTKEY_URL, data, options)
}
