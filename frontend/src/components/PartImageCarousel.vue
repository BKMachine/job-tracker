<template>
  <div>
    <div>
      <v-btn @click="print">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-btn @click="openImage">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </div>
    <v-carousel v-model="index">
      <v-carousel-item
        v-for="image in images"
        :key="image.url"
        :src="image.url"
        reverse-transition="none"
        transition="none"
      >
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'PartImageCarousel',
  props: ['images', 'index'],
  methods: {
    openImage() {
      window.open(this.images[this.index].url, '_blank')
    },
    print() {
      const win = window.open('', '', 'toolbar=0,scrollbars=0,status=0')
      let content = '<html>'
      content += '<body onload="window.print()">'
      content += `<img src="${this.images[this.index].url}">`
      content += '</body>'
      content += '</html>'
      win.document.write(content)
      win.document.close()
    },
  },
}
</script>

<style scoped></style>
