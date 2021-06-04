<template>
  <div>
    <div
      class="drop"
      :class="{ dragging }"
      @dragover.prevent="dragOver"
      @dragleave.prevent="dragLeave"
      @drop.prevent="drop($event)"
    >
      <img src="@/assets/image_icon.png" alt="" />
      <!--      <v-progress-circular :value="progress" :rotate="-90" color="primary">
        {{ progress }}
      </v-progress-circular>-->
    </div>
  </div>
  <!--    <img
      v-if="!thumbnail"
      src="@/assets/image_icon.png"
      alt=""
      style="width: 100%"
    />
    <img v-else :src="thumbnail" alt="" style="width: 100%" @drop="dropped" />
    <v-btn @click="upload">
      <v-icon> mdi-upload </v-icon>
    </v-btn>-->
</template>

<script>
// import { uploadToS3 } from '@/plugins/s3_uploader'

export default {
  name: 'PartThumbnail',
  props: ['thumbnail'],
  data() {
    return {
      dragging: false,
      progress: 0,
      error: null,
    }
  },
  methods: {
    dragOver() {
      this.dragging = true
    },
    dragLeave() {
      this.dragging = false
    },
    drop() {
      return
      /*this.dragging = false
      const files = e.dataTransfer.files
      const file = files[0]
      console.log(file)
      uploadToS3(
        file,
        (val) => {
          this.progress = val
        },
        (error) => {
          this.error = error
        },
        { uploadUrl: process.env.VUE_APP_UPLOAD_URL },
      )
        .then((data) => {
          this.$emit('thumbUpload', data.url)
        })
        .finally(() => {
          this.progress = 0
        })*/
    },
  },
}
</script>

<style scoped>
.drop {
  border: 5px #bebebe solid;
  height: 100%;
  width: 100%;
  padding: 1em;
}
.drop img {
  width: 100%;
  opacity: 50%;
}
.dragging {
  background-color: #a7a7a7;
}
.thumb img {
  width: 100%;
}
</style>
