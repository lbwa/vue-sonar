export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0

export const RECOMMEND_URL = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

export const PLAYLIST_URL = '/api/getPlayList'

export const ARTIST_URL = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

export const ARTIST_DETAIL_URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

export const LYRIC_URL = '/api/getLyric'
