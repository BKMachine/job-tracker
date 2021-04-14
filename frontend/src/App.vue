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

export default {
  name: 'App',
  components: { NavDrawer },
}
</script>

<style lang="scss"></style>
