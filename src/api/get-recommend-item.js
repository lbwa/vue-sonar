import { commonParams, options, RECOMMEND_ITEM_URL } from './config'
import jsonp from '@/common/js/jsonp'

export function getRecommendItem (recommendId) {
  const data = {
    ...commonParams,
    ...{
      typr: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      disstid: recommendId,
      loginUin: 0,
      hostUin: 0,
      platfrom: 'yqq',
      needNewCode: 0
    }
  }

  return jsonp(RECOMMEND_ITEM_URL, data, {
    ...options,
    prefix: 'playlistinfoCallback',
    name: ''
  })
}
