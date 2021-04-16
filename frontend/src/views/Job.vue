<template>
  <v-container v-if="!loading">
    <v-row justify="center">
      <div v-if="notFound">
        <h1>Job #{{ $route.params.id }} does not exist.</h1>
      </div>
      <div v-else-if="error">
        <h1 v-if="errorMessage">{{ errorMessage }}</h1>
        <h1 v-else>
          There was an error retrieving Job #{{ $route.params.id }}.
        </h1>
      </div>
      <div v-else>
        <v-card>
          <v-card-title>
            Job #{{ job.id }}
            <v-spacer></v-spacer>
            Status: {{ job.closed ? 'Closed' : 'Open' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="job.customer" label="Customer">
            </v-text-field>
          </v-card-text>
        </v-card>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Job',
  data() {
    return {
      job: {},
      notFound: false,
      error: false,
      loading: true,
      errorMessage: null,
    }
  },
  mounted() {
    this.$axios
      .get(`/job/${this.$route.params.id}`)
      .then(({ data }) => {
        this.job = data
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.notFound = true
          return
        }
        this.error = true
        if (err.response.data && err.response.data.message)
          this.errorMessage = err.response.data.message
      })
      .finally(() => {
        this.loading = false
      })
  },
}
</script>

<style scoped></style>
