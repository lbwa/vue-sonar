import { getLyric } from 'api/get-lyric'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({ id, mid, artist, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.artist = artist
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) { // 存在 this.lyric 忽略请求
      return Promise.resolve(this.lyric) // 保证返回的是一个 promise 对象
    }

    /**
     * 因为需要对 this.lyric 进行数据处理，那么需要 getSongLyric() 返回一个 promise
     * 对象。返回 promise 对象，而不直接返回值的原因是，需要对 retcode 不为 ERR_OK
     * 的情况处理。
     */

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('No lyric'))
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    artist: filterArtist(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

function filterArtist (artist) {
  let ret = []
  if (!artist) {
    return ''
  }
  artist.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
