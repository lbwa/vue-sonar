import { RANKING_LIST_URL, FULL_RANKING_LIST_URL, options, commonParams } from './config'
import jsonp from 'common/js/jsonp'

// start

// 桌面端 toplist jsonp 配置

/**
 * 原移动端 jsonp 方法改为了 ajax 请求（直接使用 jsonp 将导致格式错误），自己意外的以
 * 桌面端配置请求移动端 url 返回了正确数据
 */

export function getRankingList () {
  const data = {
    page: 'index',
    format: 'html',
    tpl: 'macv4',
    v8debug: 1
  }

  return jsonp(RANKING_LIST_URL, data, {
    ...options,
    prefix: '',
    name: 'jsonCallback'
  })
}

// 移动端 toplist jsonp 配置
// import { RANKING_LIST, commonParams, options } from './config'
// import jsonp from 'common/js/jsonp'

// export function getRankingList () {
//   const data = {
//     ...commonParams,
//     uin: 0,
//     format: 'json',
//     platform: 'h5',
//     needNewCode: 1,
//     _: +new Date()
//   }

//   return jsonp(RANKING_LIST, data, {
//     ...options,
//     prefix: '',
//     name: 'jsonCallback'
//   })
// }

// end

// 以下是请求的桌面版 url（jsonp 请求）
export function getFullRankingList (id) {
  const data = {
    ...commonParams,
    tpl: 3,
    page: 'detail',
    // data: 歌单更新日期，
    topid: id,
    type: 'top',
    song_begin: 0,
    song_num: 30,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  }

  return jsonp(FULL_RANKING_LIST_URL, data, {
    ...options,
    prefix: '',
    name: 'MusicJsonCallbacktoplist'
  })
}
