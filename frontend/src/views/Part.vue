<template>
  <v-container class="mt-10">
    <v-row>
      <v-col cols="10">
        <v-card>
          <v-card-title>
            <div class="text-h4">Some Part</div>
            <v-divider vertical class="mx-4"></v-divider>
            <v-icon class="mr-1">mdi-history</v-icon>
            <v-icon class="mr-2">mdi-clipboard-edit-outline</v-icon>
            <div class="text-body-1">In Stock: 0</div>
            <div class="ml-4 text-body-1">Location: Shelf 1 C-6</div>
            <v-spacer />
            <v-switch v-model="editing" label="Edit"></v-switch>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" :readonly="!editing">
              <v-container>
                <v-row class="mt-4">
                  <v-text-field label="Name"> </v-text-field>
                  <v-text-field label="Rev"> </v-text-field>
                  <v-select :items="customers" label="Customer"> </v-select>
                </v-row>
                <v-row>
                  <v-text-field label="Description"> </v-text-field>
                </v-row>
                <v-row>
                  <v-textarea label="Notes"> </v-textarea>
                </v-row>
              </v-container>
              <v-divider />
              <v-container>
                <v-row class="text-h6"> Material </v-row>
                <v-row>
                  <v-text-field label="Type"> </v-text-field>
                  <v-radio-group v-model="radio" row>
                    <v-radio label="Bars" value="bars" />
                    <v-radio label="Blanks" value="blanks" />
                  </v-radio-group>
                  <v-text-field label="Size"></v-text-field>
                  <v-text-field label="Cut Length"></v-text-field>
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
            <v-btn v-if="editing" color="blue" @click="save">Save</v-btn>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Part',
  data() {
    return {
      valid: null,
      customers: [],
      editing: false,
      radio: 'bars',
    }
  },
  computed: {
    partsPerLength() {
      return Math.floor(12.885)
    },
  },
  mounted() {
    this.$axios.get('/customers/names').then(({ data }) => {
      this.customers = data
    })
  },
  methods: {
    save() {
      this.editing = false
    },
  },
}
</script>

<style scoped>
.v-card__title {
  background-color: #ff7df3;
}
</style>
