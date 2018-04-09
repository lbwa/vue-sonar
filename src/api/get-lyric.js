import { commonParams, LYRIC_URL } from './config'
import axios from 'axios'

export function getLyric (mid) {
  const data = {
    ...commonParams,
    ...{
      songmid: mid,
      pcachetime: +new Date(),
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0,
      g_tk: 5381,
      format: 'json'
    }
  }

  return axios.get(LYRIC_URL, {
    params: data
  }).then(res => res.data)
}
