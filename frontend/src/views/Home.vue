<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-text-field
          v-model="search"
          label="Search..."
          append-icon="mdi-magnify"
          clearable
        />
        <v-card
          v-for="job in jobs"
          :key="job._id"
          class="mt-2"
          :class="{ upcoming: isUpcoming(job), overdue: isOverdue(job) }"
          @dblclick="openJob(job._id)"
        >
          <v-card-text>
            <v-row>
              <v-col cols="2"> #{{ job._id }} </v-col>
              <v-col cols="4">
                {{ job.partName }}
              </v-col>
              <v-col cols="4">
                {{ job.customer }}
              </v-col>
              <v-col cols="2">
                {{ dueDate(job) }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      search: null,
      jobs: [],
    }
  },
  mounted() {
    // this.$axios.get('/jobs').then(({ data }) => {
    // this.jobs = data
    // })
  },
  methods: {
    openJob(id) {
      this.$router.push(`job/${id}`)
    },
    isUpcoming(job) {
      const dueDate = this.$moment(job.dueDate)
      const now = this.$moment().startOf('day').add(7, 'days')
      return now > dueDate
    },
    isOverdue(job) {
      const dueDate = this.$moment(job.dueDate)
      const now = this.$moment().startOf('day')
      return now > dueDate
    },
    dueDate(job) {
      return this.$moment(job.dueDate).format('MM-DD-YYYY')
    },
  },
}
</script>

<style scoped>
.v-card {
  background-color: #75e546;
}
.upcoming {
  background-color: #fafa3e;
}
.overdue {
  background-color: #de5656;
}
</style>
