// 向 jsonp 实现添加参数并封装
import jsonp from '@/common/js/jsonp'
import { commonParams, options, RECOMMEND_URL } from './config'

export function getRecommend () {
  const url = RECOMMEND_URL
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
