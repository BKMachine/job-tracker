<template>
  <v-container>
    <v-row justify="center" class="mt-6">
      <v-col cols="10">
        <v-container class="mb-4">
          <v-row>
            <v-spacer />
            <v-btn>
              <v-icon>mdi-filter-plus-outline</v-icon>
            </v-btn>
          </v-row>
        </v-container>
        <v-data-table
          :headers="headers"
          :items="parts"
          sort-by="name"
          class="elevation-2"
          :search="search"
          hide-default-footer
          disable-pagination
          :loading="loading"
          @dblclick:row="openPart"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Inventory</v-toolbar-title>
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
                    New Part
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
                            :autofocus="editedIndex === -1"
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
                    Are you sure you want to delete this part?
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
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler" />
  </v-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Inventory',
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      loading: true,
      parts: [],
      search: null,
      editedIndex: -1,
      editedItem: {},
      editDialog: false,
      dialogDelete: false,
      page: 1,
      infiniteId: 0,
      headers: [
        {
          text: 'Name',
          value: 'name',
          filterable: true,
        },
        {
          text: 'Customer',
          value: 'customer',
          filterable: true,
        },
        /*{
          text: 'Contact',
          value: 'contact',
          filterable: false,
        },*/
        {
          text: 'In Stock',
          value: 'stock.quantity',
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
      return this.editedIndex === -1 ? 'New Part' : 'Edit Part'
    },
    actionTitle() {
      return this.editedIndex === -1 ? 'Save' : 'Edit'
    },
  },
  mounted() {
    /*this.$axios.get('/parts').then(({ data }) => {
      this.parts = data
      this.loading = false
    })*/
  },
  methods: {
    infiniteHandler($state) {
      this.$axios
        .get('/parts', {
          params: {
            limit: 50,
            page: this.page,
            search: this.search,
          },
        })
        .then(({ data }) => {
          this.loading = false
          if (data.parts.length) {
            this.page++
            this.parts.push(...data.parts)
            $state.loaded()
            if (this.parts.length === data.total) $state.complete()
          } else {
            $state.complete()
          }
        })
    },
    changeType() {
      this.page = 1
      this.parts = []
      this.infiniteId++
    },
    saveItem() {
      if (this.editedIndex > -1) {
        this.$axios
          .put('/parts', this.editedItem)
          .then(({ data }) => {
            Object.assign(this.customers[this.editedIndex], data)
            this.close()
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        this.$axios
          .post('/parts', this.editedItem)
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
      this.editedIndex = this.parts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.parts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.$axios
        .delete('/parts', { data: { id: this.editedItem._id } })
        .then(() => {
          this.parts.splice(this.editedIndex, 1)
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
    openPart(event, item) {
      this.$router.push(`/inventory/${item.item._id}`)
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
