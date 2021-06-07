<template>
  <v-container>
    <v-progress-linear v-if="loading" indeterminate />
    <v-row v-else class="mt-10" justify="center">
      <v-col cols="9">
        <v-card elevation="3">
          <v-card-title :class="{ editing: isEdited }">
            <div class="text-h4">{{ partName }}</div>
            <v-divider class="mx-4" vertical></v-divider>
            <v-icon class="mr-2" @click="openStock($route.params.id)">
              mdi-clipboard-edit-outline
            </v-icon>
            <div class="text-body-1">
              In Stock:
              <span class="font-weight-bold">
                {{ part.stock.quantity || 0 }}
              </span>
            </div>
            <div class="ml-4 text-body-1">
              Location:
              <span class="font-weight-bold">
                {{ part.stock.location || 'None' }}
              </span>
            </div>
            <v-spacer />
            <div v-if="isEdited">
              <v-btn class="red lighten-2 mr-2" @click="cancel">Cancel</v-btn>
              <v-btn class="green lighten-2" @click="save">Save</v-btn>
            </div>
          </v-card-title>
          <v-card-text class="mt-3">
            <v-form v-model="valid" @change="isEdited === true">
              <v-container>
                <v-row class="mt-0">
                  <v-col cols="8">
                    <v-row>
                      <v-col cols="9">
                        <v-text-field
                          v-model="part.name"
                          :rules="[rules.required]"
                          label="Name"
                        />
                      </v-col>
                      <v-col cols="3">
                        <v-text-field v-model="part.revision" label="Rev" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-model="part.customer"
                          :items="customers"
                          :rules="[rules.required]"
                          label="Customer"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <PartThumbnail
                      :thumbnail="part.thumbnail"
                      @thumbUpload="saveThumb"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="part.description"
                      label="Description"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea v-model="part.notes" label="Notes" />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
        <v-expansion-panels v-model="expanded" class="mt-3">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span>
                <span class="body-1 font-weight-medium">Material:</span>
                <span class="ml-5" v-html="materialSummary" />
              </span>
            </v-expansion-panel-header>
            <!--            <v-divider v-if="expanded === 0" class="pt-0 mb-3" />-->
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="part.material.type"
                        :rules="[rules.required]"
                        label="Type"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <template v-if="part.material.shape === 'round'">
                      <v-col cols="6">
                        <v-text-field
                          v-model="part.material.od"
                          :rules="[rules.number]"
                          label="Outer Diameter"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="part.material.id"
                          :disabled="part.material.style === 'solid'"
                          :rules="[rules.number]"
                          label="Inner Diameter"
                        />
                      </v-col>
                    </template>
                    <template v-else>
                      <v-col cols="6">
                        <v-text-field
                          v-model="part.material.height"
                          :rules="[rules.number]"
                          label="Height"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="part.material.width"
                          :rules="[rules.number]"
                          label="Width"
                        />
                      </v-col>
                    </template>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="part.material.partLength"
                        :rules="[rules.number]"
                        label="Finish Length"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="part.material.cutLength"
                        :rules="[rules.number, rules.longerThan]"
                        label="Saw Length"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="3" />
                <v-col cols="3">
                  <v-row class="my-auto">
                    <v-radio-group
                      v-model="part.material.shape"
                      class="pa-0 ma-0 mt-1"
                    >
                      <v-radio label="Square" value="square" />
                      <v-radio label="Round" value="round" />
                    </v-radio-group>
                  </v-row>
                  <v-row>
                    <v-radio-group
                      v-model="part.material.style"
                      class="pa-0 ma-0 mt-1"
                    >
                      <v-radio label="Solid" value="solid" />
                      <v-radio label="Tubing" value="tubing" />
                    </v-radio-group>
                  </v-row>
                  <v-row>
                    <v-radio-group
                      v-model="part.material.workpiece"
                      :disabled="part.material.shape === 'square'"
                      class="pa-0 ma-0 mt-1"
                    >
                      <v-radio label="Bars" value="bars" />
                      <v-radio label="Blanks" value="blanks" />
                    </v-radio-group>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!--          <v-expansion-panel>
            <v-expansion-panel-header class="body-1 font-weight-medium">
              Images
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  NYI
                  &lt;!&ndash;                  <PartImages :images="part.images" />&ndash;&gt;
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>-->
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import PartImages from '@/components/PartImages'
import PartThumbnail from '@/components/PartThumbnail'
import sharedRules from '../rules'

export default {
  name: 'Part',
  components: {
    // PartImages,
    PartThumbnail,
  },
  data() {
    return {
      customers: [],
      isEdited: false,
      editing: false,
      loading: true,
      part: {
        material: {
          shape: 'square',
          style: 'solid',
          workpiece: 'blanks',
        },
        stock: {},
        images: [],
      },
      originalPart: {
        material: {},
        stock: {},
        images: [],
      },
      valid: null,
      rules: {
        ...sharedRules,
        longerThan: (val) => {
          console.log(typeof val)
          return (
            !val ||
            parseFloat(val) >= parseFloat(this.part.material.partLength) ||
            'Shorter than the part.'
          )
        },
      },
      expanded: null,
    }
  },
  watch: {
    'part.material.shape'(val) {
      if (val === 'square') {
        this.$nextTick(() => {
          this.part.material.diameter = null
          this.part.material.workpiece = 'blanks'
          this.$forceUpdate()
        })
      } else {
        this.part.material.height = null
        this.part.material.width = null
      }
    },
  },
  computed: {
    partName() {
      if (this.part.name && this.isEdited) return `Editing: ${this.part.name}`
      return this.part.name || 'New Part'
    },
    materialSummary() {
      if (
        !this.part.material ||
        !Object.keys(this.part.material).length ||
        !this.part.material.type
      )
        return ''
      let str = '<span class="font-weight-light">'
      str +=
        this.part.material.shape === 'round'
          ? `${this.part.material.od || '-'} Ø`
          : `${this.part.material.height || '-'} x ${
              this.part.material.width || '-'
            }`
      str += '<span class="font-weight-normal mx-2">'
      str += this.part.material.type
      str += '</span>'
      str += this.part.material.style
      str += '<span class="ml-8">'
      str += this.part.material.workpiece
      str += ' cut @ '
      str += this.part.material.cutLength || '-'
      str += '</span></span>'
      return str
    },
  },
  async mounted() {
    if (this.$route.params.id !== 'new') {
      await this.$axios
        .get(`/part/${this.$route.params.id}`)
        .then(({ data }) => {
          this.part = Object.assign(this.part, data)
          this.originalPart = Object.assign(this.part, data)
        })
    } else {
      this.isEdited = true
    }
    await this.$axios.get('/customers/names').then(({ data }) => {
      this.customers = data
    })
    this.loading = false
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isEdited) return next()
    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!',
    )
    if (answer) {
      this.isEdited = false
      next()
    } else {
      next(false)
    }
  },
  methods: {
    openStock(id) {
      this.$router.push(`/part/${id}/stock`)
    },
    cancel() {
      this.part = Object.assign({}, this.originalPart)
    },
    save() {
      if (!this.valid) return
      this.$axios.put('/part', this.part).then(() => {
        this.originalPart = { ...this.part }
        this.isEdited = false
      })
    },
    saveThumb(url) {
      this.part.thumbnail = url
      this.save()
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped>
.v-card__title {
  background-color: #c58cff;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.v-card__text .col {
  padding-bottom: 0;
  padding-top: 0;
}
</style>
