<template>
  <div id="app">
    <app-header/>
    <app-tab/>
    <router-view/>
  </div>
</template>

<script>
import AppHeader from 'components/app-header/app-header'
import AppTab from 'components/app-tab/app-tab'

export default {
  name: 'App',

  components: {
    AppHeader,
    AppTab
  }
}
</script>

<style lang="scss">

</style>
