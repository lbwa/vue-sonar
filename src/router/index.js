import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/the-recommend/recommend'
import artist from 'components/the-artist/artist'
import ranking from 'components/the-ranking/ranking'
import search from 'components/the-search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend
    },
    {
      path: '/artist',
      component: artist
    },
    {
      path: '/ranking',
      component: ranking
    },
    {
      path: '/search',
      component: search
    }
  ]
})
