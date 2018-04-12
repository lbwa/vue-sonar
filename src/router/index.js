import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/the-recommend/recommend'
import RecommendItem from 'components/parts-recom-item/parts-recom-item'
import Artist from 'components/the-artist/artist'
import ArtistItem from 'components/parts-artist-item/parts-artist-item'
import Ranking from 'components/the-ranking/ranking'
import RankingItem from 'components/parts-ranking-item/parts-ranking-item'
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
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendItem
        }
      ]
    },
    {
      path: '/artist',
      component: Artist,
      children: [
        {
          path: ':id',
          component: ArtistItem
        }
      ]
    },
    {
      path: '/ranking',
      component: Ranking,
      children: [
        {
          path: ':id',
          component: RankingItem
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: ArtistItem
        }
      ]
    }
  ]
})
