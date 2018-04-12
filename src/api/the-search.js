import jsonp from 'common/js/jsonp'
import { HOTKEY_URL, SEARCH_URL, commonParams, options } from './config'
import axios from 'axios'

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

export function searchKey (key, page, zhida) {
  const data = {
    ...commonParams,
    w: key,
    p: page, // 第几页
    catZhida: zhida ? 1 : 0, // 是否解锁显示歌手
    uin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  }

  // return jsonp(SEARCH_URL, data, options)
  return axios.get(SEARCH_URL, {
    params: data
  }).then(res => res.data)
}
