import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/the-recommend/recommend'
// import RecommendItem from 'components/parts-recom-item/parts-recom-item'
// import Artist from 'components/the-artist/artist'
// import ArtistItem from 'components/parts-artist-item/parts-artist-item'
// import Ranking from 'components/the-ranking/ranking'
// import RankingItem from 'components/parts-ranking-item/parts-ranking-item'
// import Search from 'components/the-search/search'
// import UserCenter from 'components/the-user-center/the-user-center'

Vue.use(Router)

/**
 * 路由懒加载(原理：webpack 代码分割)
 * 1. https://doc.webpack-china.org/guides/code-splitting/#%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5-dynamic-imports-
 * 2. https://router.vuejs.org/zh-cn/advanced/lazy-loading.html
 */

const Recommend = (resolve) => {
  import('components/the-recommend/recommend').then(module => {
    resolve(module)
  })
}

const RecommendItem = (resolve) => {
  import('components/parts-recom-item/parts-recom-item').then(module => {
    resolve(module)
  })
}

const Artist = (resolve) => {
  import('components/the-artist/artist').then(module => {
    resolve(module)
  })
}

const ArtistItem = (resolve) => {
  import('components/parts-artist-item/parts-artist-item').then(module => {
    resolve(module)
  })
}

const Ranking = (resolve) => {
  import('components/the-ranking/ranking').then(module => {
    resolve(module)
  })
}

const RankingItem = (resolve) => {
  import('components/parts-ranking-item/parts-ranking-item').then(module => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/the-search/search').then(module => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('components/the-user-center/the-user-center').then(module => {
    resolve(module)
  })
}

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
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
