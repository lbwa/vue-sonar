// 向 jsonp 实现添加参数并封装
import jsonp from '@/common/js/jsonp'
import { commonParams, options, RECOMMEND_URL, PLAYLIST_URL } from './config'
import axios from 'axios'

export function getRecommend () {
  const url = RECOMMEND_URL
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getPlayList () {
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
