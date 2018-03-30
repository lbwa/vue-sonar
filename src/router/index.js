import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/the-recommend/recommend'
import Artist from 'components/the-artist/artist'
import Ranking from 'components/the-ranking/ranking'
import Search from 'components/the-search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/artist',
      component: Artist
    },
    {
      path: '/ranking',
      component: Ranking
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
