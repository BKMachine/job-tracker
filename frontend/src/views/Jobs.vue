<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="10">
        <v-text-field v-model="search" @change="changeType"> </v-text-field>
        <div v-for="job in jobs" :key="job._id">
          <v-card>
            <v-card-title>
              {{ job.id }}
              <v-spacer />
              <v-btn @click="printLabel(job)">
                <v-icon>mdi-label-outline</v-icon>
              </v-btn>
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
import dymoXML from '@/dymoXML'
import Dymo from 'dymojs'
import InfiniteLoading from 'vue-infinite-loading'

const dymo = new Dymo({
  hostname: process.env.VUE_APP_DYMO_HOSTNAME,
  port: process.env.VUE_APP_DYMO_PORT,
})

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
            $state.loaded()
            if (this.jobs.length === data.total) $state.complete()
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
    async printLabel(job) {
      try {
        await dymo.print('DYMO LabelWriter 450', dymoXML(job))
        this.$toasted.success('Label Printed', {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 2000,
        })
      } catch (e) {
        console.error(e)
        this.$toasted.error('Error connecting to the DYMO printer', {
          theme: 'bubble',
          position: 'bottom-right',
          duration: 2000,
        })
      }
    },
  },
}
</script>

<style scoped></style>
