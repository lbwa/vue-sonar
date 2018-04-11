// 向 jsonp 实现添加参数并封装
import jsonp from '@/common/js/jsonp'
import { commonParams, options, RECOMMEND_URL, PLAYLIST_URL, RECOMMEND_ITEM_URL } from './config'
import axios from 'axios'

export function getRecommend () {
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(RECOMMEND_URL, data, options)
}

export function getPlaylist () {
  const data = Object.assign({}, commonParams, { // 将公共参数和个体参数合并
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(PLAYLIST_URL, {
    params: data
  }).then(res => res.data)
}

export function getRecommendItem (recommendId) {
  const data = {
    ...commonParams,
    ...{
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      disstid: recommendId,
      loginUin: 0,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  }

  // 在没有 header 验证的情况下直接使用 jsonp 请求 url，否则使用后端 ajax 代理
  // return jsonp(RECOMMEND_ITEM_URL, data, {
  //   ...options,
  //   // https://github.com/webmodules/jsonp/blob/master/index.js#L50
  //   prefix: '', // 回调函数前缀，默认值为 __jp
  //   name: 'playlistinfoCallback' // 回调函数名，默认值为从 0 开始的计数器
  // })

  return axios.get(RECOMMEND_ITEM_URL, {
    params: data
  }).then(res => res.data)
}
