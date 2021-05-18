<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="10">
        <v-text-field v-model="search" @change="changeType"> </v-text-field>
        <div v-for="job in jobs" :key="job._id">
          <v-card>
            <v-card-title>
              {{ job.id }}
            </v-card-title>
          </v-card>
        </div>
        <infinite-loading
          :identifier="infiniteId"
          @infinite="infiniteHandler"
        />
        <!--        <v-data-table
          :headers="headers"
          :items="jobs"
          sort-by="_id"
          class="elevation-2"
          :search="search"
          hide-default-footer
          disable-pagination
          :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Jobs</v-toolbar-title>
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
            </v-toolbar>
          </template>
        </v-data-table>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Jobs',
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      infiniteId: 0,
      loading: true,
      search: null,
      headers: [],
      page: 1,
      jobs: [],
    }
  },
  mounted() {
    // this.$axios.get('/jobs').then(({ data }) => {
    // this.jobs = data
    // })
  },
  methods: {
    infiniteHandler($state) {
      this.$axios
        .get('/jobs', {
          params: {
            limit: 50,
            page: this.page,
            search: this.search,
          },
        })
        .then(({ data }) => {
          if (data.jobs.length) {
            this.page++
            this.jobs.push(...data.jobs)
            if (this.jobs.length === data.total) return $state.complete()
            $state.loaded()
          } else {
            $state.complete()
          }
        })
    },
    changeType() {
      this.page = 1
      this.jobs = []
      this.infiniteId++
    },
  },
}
</script>

<style scoped></style>
