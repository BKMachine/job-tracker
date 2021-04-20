<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate />
    <v-container v-else class="mt-6">
      <v-row justify="center">
        <v-col cols="10">
          <v-card light>
            <v-card-title :class="{ editing: isEdited }">
              <div class="text-h4">{{ partName }}</div>
              <v-divider vertical class="mx-4 mt-0 mb-0"></v-divider>
              <v-icon class="mr-1">mdi-history</v-icon>
              <v-icon class="mr-2">mdi-clipboard-edit-outline</v-icon>
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
            <v-card-text>
              <v-form v-model="valid" @change="isEdited === true">
                <v-container>
                  <v-row class="mt-0">
                    <v-col cols="5">
                      <v-text-field
                        v-model="part.name"
                        label="Name"
                        :rules="rules.req"
                      />
                    </v-col>
                    <v-col cols="2">
                      <v-text-field v-model="part.revision" label="Rev" />
                    </v-col>
                    <v-col cols="5">
                      <v-select
                        v-model="part.customer"
                        :items="customers"
                        label="Customer"
                        :rules="rules.req"
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
                <v-container>
                  <v-row class="text-h6">
                    <v-col cols="3"> Material </v-col>
                    <v-col cols="3" style="text-align: center">
                      <v-radio-group
                        v-model="part.material.shape"
                        row
                        class="pa-0 ma-0 mt-1"
                      >
                        <v-radio label="Square" value="square" />
                        <v-radio label="Round" value="round" />
                      </v-radio-group>
                    </v-col>
                    <v-col cols="3" style="text-align: center">
                      <v-radio-group row class="pa-0 ma-0 mt-1">
                        <v-radio label="Solid" value="solid" />
                        <v-radio label="Tubing" value="tubing" />
                      </v-radio-group>
                    </v-col>
                    <v-col cols="3" style="text-align: center">
                      <v-radio-group
                        v-model="part.material.workpiece"
                        :disabled="part.material.shape === 'square'"
                        row
                        class="pa-0 ma-0 mt-1"
                      >
                        <v-radio label="Bars" value="bars" />
                        <v-radio label="Blanks" value="blanks" />
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="part.material.materialType"
                            label="Type"
                            :rules="rules.req"
                          />
                        </v-col>
                        <v-col v-if="part.material.shape === 'round'" cols="2">
                          <v-text-field
                            v-model="part.material.diameter"
                            label="Diameter"
                            :rules="rules.number"
                          />
                        </v-col>
                        <v-col v-else cols="2">
                          <v-text-field
                            v-model="part.material.height"
                            label="Height"
                            :rules="rules.number"
                          />
                          X
                          <v-text-field
                            v-model="part.material.width"
                            label="Width"
                            :rules="rules.number"
                          />
                        </v-col>
                        <v-col cols="2">
                          <v-text-field
                            v-model="part.material.partLength"
                            label="Finish Length"
                            :rules="rules.number"
                          />
                        </v-col>
                        <v-col cols="2">
                          <v-text-field
                            v-model="part.material.cutLength"
                            label="Saw Length"
                            :rules="rules.number"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'Part',
  data() {
    return {
      customers: [],
      isEdited: false,
      editing: false,
      loading: true,
      part: {
        material: {},
        stock: {},
      },
      originalPart: {
        material: {},
        stock: {},
      },
      valid: null,
      rules: {
        req: [(val) => (val || '').length > 0 || 'This field is required'],
        number: [
          (val) => {
            if (!val) return true
            return /^[0-9.]+$/.test(val) || 'Must be a number.'
          },
        ],
      },
    }
  },
  watch: {
    /*part: {
      handler() {
        this.isEdited = !_.isEqual(this.part, this.originalPart)
      },
      deep: true,
    },*/
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
    partsPerLength() {
      if (!this.part.material.partLength) return 'null'
      const length = parseFloat(this.part.material.partLength)
      return Math.floor(144 / length)
    },
    partName() {
      if (this.part.name && this.isEdited) return `Editing: ${this.part.name}`
      return this.part.name || 'New Part'
    },
  },
  async mounted() {
    if (this.$route.params.id !== 'new') {
      await this.$axios
        .get(`/part/${this.$route.params.id}`)
        .then(({ data }) => {
          this.part = Object.assign({}, data)
          this.originalPart = Object.assign({}, data)
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
    required(val) {
      return (val || '').length > 0 || 'This field is required'
    },
  },
}
</script>

<style scoped>
.v-card__title {
  background-color: #c58cff;
  padding-top: 0.75em;
  padding-bottom: 0.75em;
}
.v-card__title.editing {
  /*background-color: #f78cff;*/
}
.v-card__text .col {
  padding-bottom: 0;
  padding-top: 0;
}
</style>
