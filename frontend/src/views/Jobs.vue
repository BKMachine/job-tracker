<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="jobs"
          sort-by="_id"
          class="elevation-2"
          :search="search"
          hide-default-footer
          disable-pagination
          :loading="loading"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Jobs',
  data() {
    return {
      loading: true,
      search: null,
      headers: [],
      jobs: [],
    }
  },
}
</script>

<style scoped></style>
