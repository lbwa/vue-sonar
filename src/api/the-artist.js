import jsonp from '@/common/js/jsonp'
import { commonParams, options, ARTIST_URL, ARTIST_DETAIL_URL } from './config'

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

export function getArtistDetail (artistId) {
  const data = {
    ...commonParams,
    ...{
      g_tk: 1471438518,
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: 0,
      num: 30,
      songstatus: 1,
      singermid: artistId
    }
  }
  return jsonp(ARTIST_DETAIL_URL, data, options)
}
