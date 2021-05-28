<template>
  <v-app>
    <NavDrawer />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from '@/components/NavDrawer'
import scanner from './scanner'

export default {
  name: 'App',
  components: { NavDrawer },
  mounted() {
    scanner()
    window.addEventListener('keydown', (event) => {
      console.log(event)
    })
  },
}
</script>

<style lang="scss">
@import '../node_modules/@braid/vue-formulate/themes/snow/snow.scss';
</style>

<style>
/*#app {
  background-color: #121212;
}*/
</style>
