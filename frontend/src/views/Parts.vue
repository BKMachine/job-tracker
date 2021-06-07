<template>
  <v-container>
    <v-row class="mt-10" justify="center">
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
                <v-btn v-bind="attrs" v-on="on">
                  Filter
                  <v-icon class="ml-1">mdi-filter-plus-outline</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title> Filter </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-container>
                    <v-form ref="filterForm" v-model="valid">
                      <v-row class="mt-2">
                        <v-select
                          v-model="filterKey"
                          :items="filterKeys"
                          :rules="[rules.required]"
                          label="Filter By"
                        />
                      </v-row>
                      <v-row v-if="filterKey === 'Customer'">
                        <v-select
                          v-model="filterValue"
                          :items="customers"
                          :rules="[rules.required]"
                          label="Customer Name"
                        />
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click="closeFilterDialog"> Cancel </v-btn>
                  <v-spacer />
                  <v-btn
                    :disabled="!valid"
                    color="blue darken-1"
                    text
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
          :loading="loading"
          :search="search"
          class="elevation-2"
          sort-by="name"
          disable-pagination
          hide-default-footer
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Parts</v-toolbar-title>
              <v-spacer />
              <v-text-field
                v-model="search"
                class="mr-3"
                label="Search"
                prepend-icon="mdi-magnify"
                clearable
                hide-details
                single-line
              />
              <v-btn color="primary" @click="newPart"> New Part </v-btn>
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
          <template v-slot:item.stock.quantity="{ item }">
            <v-icon class="mr-1" small @click="openStock(item._id)">
              mdi-clipboard-edit-outline
            </v-icon>
            {{ item.stock.quantity }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler" />
  </v-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import sharedRules from '../rules'

export default {
  name: 'Parts',
  components: { InfiniteLoading },
  data() {
    return {
      loading: true,
      parts: [],
      customers: [],
      search: null,
      page: 1,
      infiniteId: 0,
      filterDialog: false,
      filterKeys: ['Customer'],
      filterKey: null,
      filterComparison: null,
      filterValue: null,
      filters: [],
      valid: false,
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
        ...sharedRules,
      },
    }
  },
  mounted() {
    this.$axios.get('/customers/names').then(({ data }) => {
      this.customers = data
    })
  },
  methods: {
    openStock(id) {
      this.$router.push(`/part/${id}/stock`)
    },
    infiniteHandler($state) {
      this.$axios
        .post(
          '/parts',
          { filters: this.filters },
          {
            params: {
              limit: 50,
              page: this.page,
            },
          },
        )
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
      const maxLength = 36
      if (text.length <= maxLength) return text
      return `${text.slice(0, maxLength).trim()}...`
    },
    addFilter() {
      if (this.filterKey === 'Customer') this.filterComparison = 'eq'
      this.filters.push({
        key: this.filterKey.toLowerCase(),
        comparison: this.filterComparison,
        value: this.filterValue,
      })
      this.closeFilterDialog()
      this.changeType()
    },
    removeFilter(index) {
      this.filters.splice(index, 1)
      this.changeType()
    },
    closeFilterDialog() {
      this.filterDialog = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.filterKey = null
          this.filterComparison = null
          this.filterValue = null
          this.$refs.filterForm.reset()
        })
      }, 500)
    },
  },
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
