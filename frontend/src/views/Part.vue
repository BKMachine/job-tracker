<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate />
    <v-container v-else class="mt-6">
      <v-row justify="center">
        <v-col cols="10">
          <v-card light>
            <v-card-title>
              <div class="text-h4">{{ partName }}</div>
              <v-divider vertical class="mx-4 mt-2 mb-2"></v-divider>
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
              <v-switch v-model="editing" label="Edit"></v-switch>
            </v-card-title>
            <v-card-text>
              <v-form v-model="valid" :readonly="!editing">
                <v-container>
                  <v-row class="mt-2">
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
                      <v-textarea
                        v-model="part.notes"
                        label="Notes"
                        auto-grow
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-container>
                  <v-row>
                    <v-col cols="2" class="text-h6"> Material </v-col>
                    <v-spacer />
                    <v-col cols="4">
                      <v-radio-group
                        v-model="part.material.shape"
                        label="Shape"
                        row
                      >
                        <v-radio label="Square" value="square" />
                        <v-radio label="Round" value="round" />
                      </v-radio-group>
                    </v-col>
                    <v-col cols="4">
                      <v-radio-group
                        v-model="part.material.workpiece"
                        :disabled="part.material.shape !== 'round'"
                        row
                      >
                        <v-radio label="Bars" value="bars" />
                        <v-radio label="Blanks" value="blanks" />
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="part.material.materialType"
                        label="Type"
                      />
                    </v-col>
                    <v-col v-if="part.material.shape === 'round'" cols="5">
                      <v-text-field
                        v-model="part.material.diameter"
                        label="Diameter"
                      />
                    </v-col>
                    <v-col v-else cols="5">
                      <v-text-field
                        v-model="part.material.height"
                        label="Height"
                      />
                      X
                      <v-text-field
                        v-model="part.material.width"
                        label="Width"
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="part.materialLength"
                        label="Cut Length"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      readonly
                      label="Parts per 12' length"
                      :value="partsPerLength"
                    />
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
          <v-container>
            <v-row class="mt-4">
              <v-spacer />
              <v-btn
                v-if="editing"
                color="blue"
                :disabled="!valid"
                @click="save"
              >
                Save
              </v-btn>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Part',
  data() {
    return {
      customers: [],
      editing: false,
      loading: true,
      part: {
        material: {},
        stock: {},
      },
      valid: null,
      rules: {
        req: [(val) => (val || '').length > 0 || 'This field is required'],
      },
    }
  },
  computed: {
    partsPerLength() {
      if (!this.part.materialLength) return 'null'
      const length = parseFloat(this.part.materialLength)
      return Math.floor(144 / length)
    },
    materialSizeLabel() {
      if (this.part.materialShape === 'bars') return 'Diameter'
      return 'Size'
    },
    partName() {
      return this.part.name || 'New Part'
    },
  },
  async mounted() {
    if (this.$route.params.id !== 'new') {
      await this.$axios
        .get(`/part/${this.$route.params.id}`)
        .then(({ data }) => {
          this.part = data
        })
    } else {
      this.editing = true
    }
    await this.$axios.get('/customers/names').then(({ data }) => {
      this.customers = data
    })
    this.loading = false
  },
  beforeRouteLeave(to, from, next) {
    if (!this.editing) return next()
    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!',
    )
    if (answer) {
      this.editing = false
      next()
    } else {
      next(false)
    }
  },
  methods: {
    save() {
      if (!this.valid) return
      this.$axios.put('/part', this.part).then(() => {
        this.editing = false
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
  padding-top: 0.25em;
  padding-bottom: 0.25em;
}
</style>
