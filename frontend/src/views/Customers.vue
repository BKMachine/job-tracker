<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <v-container>
      <v-row justify="center" class="mt-10">
        <v-col cols="10">
          <v-data-table
            :headers="headers"
            :items="customers"
            sort-by="name"
            class="elevation-2"
            :search="search"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Customers</v-toolbar-title>
                <v-spacer />
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  class="mr-3"
                  :clearable="true"
                />
                <v-dialog v-model="editDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      New Customer
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                              required
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.address"
                              label="Address"
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
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="gray darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-spacer />
                      <v-btn color="blue darken-1" text @click="saveItem">
                        {{ actionTitle }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="headline">
                      {{ editedItem.name }}
                    </v-card-title>
                    <v-card-text>
                      Are you sure you want to delete this customer?
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="grey darken-1" text @click="closeDelete">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                      >
                        OK
                      </v-btn>
                      <v-spacer />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-row class="mr-0">
                <v-spacer></v-spacer>
                <v-icon
                  v-if="item.address"
                  small
                  class="mr-2"
                  @click="openMap(item)"
                >
                  mdi-map-marker
                </v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </v-row>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input'
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
      editDialog: false,
      dialogDelete: false,
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
        /*{
          text: 'Contact',
          value: 'contact',
          filterable: false,
        },*/
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
        },
      ],
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer'
    },
    actionTitle() {
      return this.editedIndex === -1 ? 'Save' : 'Edit'
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
      if (this.editedIndex > -1) {
        this.$axios
          .put('/customers', this.editedItem)
          .then(({ data }) => {
            Object.assign(this.customers[this.editedIndex], data)
            this.close()
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        this.$axios
          .post('/customers', this.editedItem)
          .then(({ data }) => {
            this.customers.push(data)
            this.close()
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.$axios
        .delete('/customers', { data: { id: this.editedItem._id } })
        .then(() => {
          this.customers.splice(this.editedIndex, 1)
          this.closeDelete()
        })
    },
    close() {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = {}
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = {}
        this.editedIndex = -1
      })
    },
    openMap(item) {
      const query = encodeURIComponent(`${item.name} ${item.address}`)
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`
      window.open(url, '_blank')
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
