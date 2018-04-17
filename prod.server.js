const express = require('express')
const config = require('./config/index')
const axios = require('axios')

const app = express()

const apiRoutes = express.Router()

// recommend list
apiRoutes.get('/getPlayList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }, err => {
    throw Error(`Proxy failed, ${err}`)
  })
})

// lyric
apiRoutes.get('/getLyric', (req, res) => {
  const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg`

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let ret = response.data

    if (typeof ret === 'string') {
      const reg = /^\w+\(({[^()]+})\)$/
      const matches = ret.match(reg)

      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }, err => {
    throw Error(`Proxy failed, ${err}`)
  })
})

// recommend item
apiRoutes.get('/getRecommendItem', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const query = req.query.disstid

  axios.get(url, {
    headers: {
      referer: `https://y.qq.com/n/yqq/playsquare/${query}.html`,
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let ret = response.data

    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)

      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }, err => {
    throw Error(`Proxy failed, ${err}`)
  })
})

// search
apiRoutes.get('/search', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }, err => {
    throw Error(`Proxy failed, ${err}`)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./docs'))

const port = process.env.PORT || config.build.port

module.exports = app.listen(port , function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:' + port + '\n')
})
