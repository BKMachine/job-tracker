<template>
  <v-container v-if="!loading" fill-height fluid>
    <v-row justify="center" align="center">
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
        <h1>{{ $route.params.id }}</h1>
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
