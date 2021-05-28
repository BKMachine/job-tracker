<template>
  <div>
    <v-row>
      <v-btn @click="addImages = true">Add Files</v-btn>
    </v-row>
    <v-row>
      <div v-for="(image, i) in images" :key="image.url">
        <img :src="image.url" alt="part image" @click="openCarousel(i)" />
      </div>
    </v-row>
    <v-dialog v-model="showCarousel">
      <PartImageCarousel :images="images" :index="index" />
    </v-dialog>
    <v-dialog v-model="addImages" max-width="800px">
      <v-card>
        <v-card-title style="background-color: #00e1ff">
          Add Files
        </v-card-title>
        <v-card-text class="mt-6">
          <v-row justify="center">
            <FormulateInput
              id="images"
              type="file"
              name="part"
              label="Select or drag files to upload"
              multiple
            />
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addImages = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PartImageCarousel from '@/components/PartImageCarousel'

export default {
  name: 'PartImages',
  props: ['images'],
  components: { PartImageCarousel },
  data() {
    return {
      showCarousel: false,
      addImages: false,
      index: -1,
    }
  },
  methods: {
    openCarousel(i) {
      this.index = i
      this.showCarousel = true
    },
  },
}
</script>

<style scoped>
img {
  height: 100px;
}
#images .formulate-input-upload-area {
  padding: 7em 20em;
}
</style>
