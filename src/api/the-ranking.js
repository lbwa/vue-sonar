import { RANKING_LIST, options } from './config'
import jsonp from 'common/js/jsonp'

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

  return jsonp(RANKING_LIST, data, {
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
