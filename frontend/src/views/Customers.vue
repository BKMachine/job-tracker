<template>
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
          :loading="loading"
          light
          @click:row="editRow"
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
                clearable
              />
              <v-dialog v-model="editDialog" persistent max-width="600px" light>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on">
                    New Customer
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title style="background-color: #5ddb5d">
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="form" v-model="valid">
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                              :autofocus="editedIndex === -1"
                              :rules="[uniqueName, required]"
                              autocomplete="false"
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
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.email"
                              label="Email"
                              :rules="[email]"
                            />
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="gray darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="blue darken-1"
                      text
                      :disabled="!valid"
                      @click="saveItem"
                    >
                      {{ actionTitle }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="deleteDialog" max-width="500px" light>
                <v-card>
                  <v-card-title
                    class="headline"
                    style="background-color: #ff819b"
                  >
                    {{ editedItem.name }}
                  </v-card-title>
                  <v-card-text class="body-1 mt-6 pb-0">
                    Are you sure you want to delete this customer?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="grey darken-1" text @click="closeDelete">
                      No
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirm"
                    >
                      Yes
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
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </v-row>
          </template>
          <template v-slot:item.address="{ item }">
            <span>
              <img
                v-if="item.address"
                class="pin mr-1"
                src="@/assets/pin.png"
                alt="test"
                @click="openMap(item)"
              />
            </span>
            {{ item.address }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
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
      click: false,
      loading: true,
      customers: [],
      search: null,
      editedIndex: -1,
      editedItem: {},
      editedName: null,
      editDialog: false,
      deleteDialog: false,
      valid: false,
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
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'New Customer'
        : `Edit - ${this.editedName}`
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
      this.$refs.form.validate()
      if (!this.valid) return
      if (this.editedIndex > -1) {
        this.$axios
          .put('/customers', this.editedItem)
          .then(({ data }) => {
            Object.assign(this.customers[this.editedIndex], data)
            this.close()
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
            this.close()
            this.$toasted.success(`${this.editedItem.name} added`)
          })
          .catch((err) => {
            console.error(err)
            this.$toasted.error(`Error adding ${this.editedItem.name}`)
          })
      }
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedName = item.name
      this.editDialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.deleteDialog = true
    },
    deleteItemConfirm() {
      this.$axios
        .delete('/customers', { data: { id: this.editedItem._id } })
        .then(() => {
          this.customers.splice(this.editedIndex, 1)
          this.closeDelete()
          this.$toasted.success(`${this.editedItem.name} deleted`)
        })
        .catch((e) => {
          console.error(e)
          this.$toasted.error(`Error deleting the ${this.editedItem.name}`)
        })
    },
    close() {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = {}
        this.editedIndex = -1
        this.editedName = null
        this.$refs.form.resetValidation()
      })
    },
    closeDelete() {
      this.deleteDialog = false
      this.$nextTick(() => {
        this.editedItem = {}
        this.editedIndex = -1
        this.editedName = null
      })
    },
    openMap(item) {
      const query = encodeURIComponent(`${item.name} ${item.address}`)
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`
      window.open(url, '_blank')
    },
    editRow(e) {
      if (!this.click) {
        this.click = true
        setTimeout(() => {
          this.click = false
        }, 500)
        return
      }
      this.editItem(e)
    },
    uniqueName(val) {
      if (!val) return true
      if (this.editedName) {
        if (
          this.editedName.toLowerCase() === this.editedItem.name.toLowerCase()
        )
          return true
      }
      const exists = this.customers.findIndex(
        (x) => x.name.toLowerCase() === val.toLowerCase(),
      )
      return exists === -1 || 'Customer name already exists'
    },
    required(val) {
      return !!val || 'Required'
    },
    email(val) {
      return (
        !val ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
        'Invalid Email'
      )
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
.pin {
  cursor: pointer;
  width: 10px;
  height: 16px;
  position: relative;
  top: 2px;
}
</style>
