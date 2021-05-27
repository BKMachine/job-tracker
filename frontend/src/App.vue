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
  mounted() {
    navigator.usb.getDevices().then((devices) => {
      console.log('Total devices: ' + devices.length)
      devices.forEach((device) => {
        console.log(
          'Product name: ' +
            device.productName +
            ', serial number ' +
            device.serialNumber,
        )
      })
    })
  },
}
</script>

<style lang="scss">
@import '../node_modules/@braid/vue-formulate/themes/snow/snow.scss';
</style>
