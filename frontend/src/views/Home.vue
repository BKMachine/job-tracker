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
      headers: [
        {
          text: 'Job #',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {
          text: 'Part #',
          sortable: true,
          value: 'partName',
        },
        {
          text: 'Customer',
          sortable: true,
          value: 'customer',
        },
        {
          text: 'Qty',
          value: 'quantity',
        },
        {
          text: 'Due Date',
          value: 'dueDate',
        },
      ],
      jobs: [
        {
          _id: 1,
          dueDate: '2021-04-14T06:00:00.000Z',
          partName: 'part',
          customer: 'customer',
        },
        {
          _id: 2,
          dueDate: '2021-04-15T06:00:00.000Z',
          partName: 'part',
          customer: 'customer',
        },
        {
          _id: 3,
          dueDate: '2021-04-16T06:00:00.000Z',
          partName: 'part',
          customer: 'customer',
        },
        {
          _id: 4,
          dueDate: '2021-04-30T06:00:00.000Z',
          partName: 'part',
          customer: 'customer',
        },
      ],
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
