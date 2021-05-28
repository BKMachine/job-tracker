<template>
  <v-container>
    <v-row justify="center" class="mt-6">
      <v-col cols="9">
        <v-container class="mb-4">
          <v-row>
            <v-chip
              v-for="(filter, i) in filters"
              :key="filter"
              class="mr-2"
              close
              close-icon="mdi-close"
              @click:close="removeFilter(i)"
            >
              {{ filter }}
            </v-chip>
            <v-spacer />
            <v-dialog v-model="filterDialog" max-width="600px" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" color="#71f17a" v-on="on">
                  Filter<v-icon class="ml-1">mdi-filter-plus-outline</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title style="background-color: #71f17a">
                  Filter
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="filterForm" v-model="filterFormValid">
                      <v-row class="mt-2">
                        <v-select
                          v-model="filterKey"
                          label="Filter By"
                          :items="filterKeys"
                          :rules="[rules.required]"
                        />
                      </v-row>
                      <v-row v-if="filterKey === 'Customer'">
                        <v-select
                          v-model="filterCustomer"
                          :items="customers"
                          label="Customer Name"
                          :rules="[rules.required]"
                        />
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click="closeFilterDialog"> Cancel </v-btn>
                  <v-spacer />
                  <v-btn
                    text
                    color="blue darken-1"
                    :disabled="!filterFormValid"
                    @click="addFilter"
                  >
                    Apply
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Parts</v-toolbar-title>
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
              <v-btn color="primary" dark @click="newPart"> New Part </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-icon class="mr-2" @click="openPart(item)">
              mdi-open-in-new
            </v-icon>
            <span class="font-weight-medium">
              {{ item.name }}
            </span>
          </template>
          <template v-slot:item.description="{ item }">
            {{ trimDesc(item.description) }}
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
  name: 'Parts',
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      loading: true,
      parts: [],
      customers: [],
      filters: ['thing1', 'thing2'],
      filterKeys: ['Customer', 'Stock Qty'],
      filterFormValid: false,
      comparisons: [{ text: '=', value: 'equal' }],
      filterDialog: false,
      search: null,
      filterKey: null,
      page: 1,
      infiniteId: 0,
      headers: [
        {
          text: 'Name',
          value: 'name',
          filterable: true,
        },
        {
          text: 'Description',
          value: 'description',
          filterable: true,
        },
        {
          text: 'Customer',
          value: 'customer',
          filterable: true,
        },
        {
          text: 'In Stock',
          value: 'stock.quantity',
          filterable: false,
        },
      ],
      rules: {
        required(val) {
          return !!val || 'Required'
        },
      },
    }
  },
  mounted() {
    this.$axios.get('/customers/names').then(({ data }) => {
      this.customers = data
    })
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
    dblClickRow(event, row) {
      this.openPart(row.item)
    },
    openPart(item) {
      this.$router.push(`/part/${item._id}`)
    },
    newPart() {
      this.$router.push('/part/new')
    },
    trimDesc(text) {
      const maxLength = 50
      if (text.length <= maxLength) return text
      return `${text.slice(0, maxLength).trim()}...`
    },
    removeFilter(index) {
      this.filters.splice(index, 1)
      this.changeType()
    },
    closeFilterDialog() {
      this.filterDialog = false
      this.$refs.filterForm.reset()
    },
    addFilter() {
      this.filters.push('New Filter')
      this.closeFilterDialog()
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
