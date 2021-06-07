<template>
  <v-container>
    <v-row class="mt-10" justify="center">
      <v-col cols="9">
        <v-data-table
          :headers="headers"
          :items="customers"
          :loading="loading"
          :search="search"
          class="elevation-3"
          sort-by="name"
          hide-default-footer
          disable-pagination
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title> Customers </v-toolbar-title>
              <v-spacer />
              <v-text-field
                v-model="search"
                class="mr-3"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
                single-line
              />
              <v-dialog
                v-model="editDialog"
                :persistent="!viewOnly"
                max-width="600px"
                @click:outside="closeDialog"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on">
                    New Customer
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    class="headline"
                    style="background-color: #5ddb5d"
                  >
                    {{ formTitle }}
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="form" v-model="valid" :readonly="viewOnly">
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.name"
                              :autofocus="editedIndex === -1"
                              :rules="[rules.required, rules.uniqueName]"
                              autocomplete="false"
                              label="Name"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.address"
                              append-icon="mdi-map-marker"
                              label="Address"
                              @click:append="sendEmail(editedItem)"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              v-model="editedItem.contact"
                              label="Contact"
                            />
                          </v-col>
                          <v-col cols="6">
                            <VuePhoneNumberInput
                              v-model="editedItem.phone"
                              :no-country-selector="true"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.email"
                              :rules="[rules.email]"
                              append-icon="mdi-email-outline"
                              label="Email"
                              @click:append="sendEmail"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.website"
                              :rules="[rules.url]"
                              append-icon="mdi-open-in-new"
                              label="Website"
                              @click:append="openSite"
                            />
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <template v-if="!viewOnly">
                      <v-btn color="gray darken-1" text @click="reset">
                        Cancel
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        :disabled="!valid"
                        color="blue darken-1"
                        text
                        @click="saveItem"
                      >
                        Save
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-spacer />
                      <v-btn color="gray darken-1" text @click="reset">
                        Close
                      </v-btn>
                    </template>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-icon class="mr-2" @click="viewItem(item)">
              mdi-open-in-new
            </v-icon>
            <span class="font-weight-medium">
              {{ item.name }}
            </span>
          </template>
          <template v-slot:item.address="{ item }">
            <v-icon class="mr-1" color="red" small @click="openMap(item)">
              mdi-map-marker
            </v-icon>
            {{ item.address }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-row class="mr-0">
              <v-spacer></v-spacer>
              <v-icon class="mr-2" small @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input'
import sharedRules from '../rules'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

export default {
  name: 'Customers',
  components: {
    VuePhoneNumberInput,
  },
  data() {
    return {
      loading: true,
      customers: [],
      search: null,
      editedIndex: -1,
      editedItem: {},
      editedName: null,
      editDialog: false,
      valid: false,
      viewOnly: false,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Address',
          value: 'address',
          filterable: false,
        },
        {
          text: 'Phone',
          value: 'phone',
          filterable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
          align: 'end',
        },
      ],
      rules: {
        ...sharedRules,
        uniqueName: (val) => {
          if (!val) return true
          if (this.editedName) {
            if (
              this.editedName.toLowerCase() ===
              this.editedItem.name.toLowerCase()
            )
              return true
          }
          const exists = this.customers.findIndex(
            (x) => x.name.toLowerCase() === val.toLowerCase(),
          )
          return exists === -1 || 'Customer name already exists'
        },
      },
    }
  },
  computed: {
    formTitle() {
      if (this.viewOnly) return this.editedName
      return this.editedIndex === -1
        ? 'New Customer'
        : `Edit - ${this.editedName}`
    },
  },
  mounted() {
    this.$axios.get('/customers').then(({ data }) => {
      this.customers = data
      this.loading = false
    })
  },
  methods: {
    saveItem() {
      this.$refs.form.validate()
      if (!this.valid) return
      if (this.editedIndex > -1) {
        this.$axios
          .put('/customers', this.editedItem)
          .then(({ data }) => {
            Object.assign(this.customers[this.editedIndex], data)
            this.reset()
            this.$toasted.success(`${this.editedItem.name} updated`)
          })
          .catch((err) => {
            console.error(err)
            this.$toasted.error(`Error editing ${this.editedItem.name}`)
          })
      } else {
        this.$axios
          .post('/customers', this.editedItem)
          .then(({ data }) => {
            this.customers.push(data)
            this.reset()
            this.$toasted.success(`${this.editedItem.name} added`)
          })
          .catch((err) => {
            console.error(err)
            this.$toasted.error(`Error adding ${this.editedItem.name}`)
          })
      }
    },
    dblClickRow(event, row) {
      this.viewItem(row.item)
    },
    viewItem(item) {
      this.viewOnly = true
      this.editItem(item)
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedName = item.name
      this.editDialog = true
    },
    closeDialog() {
      if (!this.viewOnly) return
      this.reset()
    },
    reset() {
      this.editDialog = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.editedItem = {}
          this.editedIndex = -1
          this.editedName = null
          this.viewOnly = false
          this.$refs.form.resetValidation()
        })
      }, 500)
    },
    openMap(item) {
      const query = encodeURIComponent(`${item.name} ${item.address}`)
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`
      window.open(url, '_blank')
    },
    openSite() {
      if (!this.editedItem.website) return
      window.open(this.editedItem.website, '_blank')
    },
    sendEmail() {
      if (!this.editedItem.email) return
      window.open(`mailto:${this.editedItem.email}`)
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
