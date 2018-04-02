import jsonp from '@/common/js/jsonp'
import { commonParams, options, ARTIST_URL } from './config'

export function getArtistList () {
  const data = {
    ...commonParams,
    ...{
      channel: 'singer',
      page: 'list',
      key: 'all_all_all',
      pagesize: 100,
      pagenum: 1,
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      g_tk: 1471438518 // 后面的拓展运算符的值会覆盖之前的同 key 的值， Object.assign 同理
    }
  }
  return jsonp(ARTIST_URL, data, options)
}
