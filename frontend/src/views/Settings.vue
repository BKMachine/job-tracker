<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="9">
        <v-card>
          <v-card-text>
            <v-btn @click="pair">Connect to Scanner</v-btn>
            <div v-if="device">
              <div>Manufacturer: {{ device.manufacturerName }}</div>
              <div>Model: {{ device.productName }}</div>
              <div>Serial Number: {{ device.serialNumber }}</div>
            </div>
            <div v-else>No device connected.</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      device: null,
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    pair() {
      navigator.usb.requestDevice({ filters: [] }).then((device) => {
        localStorage.setItem('usbVendor', device.vendorId)
        localStorage.setItem('usbSerial', device.serialNumber)
        this.list()
      })
    },
    list() {
      navigator.usb.getDevices().then((devices) => {
        const vendor = localStorage.getItem('usbVendor')
        const serial = localStorage.getItem('usbSerial')
        if (!vendor || !serial) return
        const device = devices.find(
          (x) => x.vendorId === parseInt(vendor) && x.serialNumber === serial,
        )
        if (device) this.device = device
      })
    },
  },
}
</script>

<style scoped></style>
