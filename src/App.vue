<template>
  <div id="app">
    <app-header/>

    <app-tab/>

    <keep-alive>
      <router-view/>
    </keep-alive>

    <AppPlayer/>
  </div>
</template>

<script>
import AppHeader from 'components/app-header/app-header'
import AppTab from 'components/app-tab/app-tab'
import AppPlayer from 'components/app-player/app-player'

export default {
  name: 'App',

  components: {
    AppHeader,
    AppTab,
    AppPlayer
  }
}
</script>

<style lang="scss">

</style>
