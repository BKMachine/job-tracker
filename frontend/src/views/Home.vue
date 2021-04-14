<template>
  <v-container>
    <v-row class="justify-center">
      <v-data-table :items="jobs" :headers="headers"> </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
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
          id: '1000',
          partName: 'Part X',
          customer: 'Some Customer',
          quantity: 1000,
          dueDate: '5/15/2002',
        },
        {
          id: '1001',
          partName: 'Part Y',
          customer: 'Some Customer',
          quantity: 100,
          dueDate: '5/15/2002',
        },
        {
          id: '1005',
          partName: 'Part Z',
          customer: 'Some Customer',
          quantity: 300,
          dueDate: '5/15/2002',
        },
      ],
    }
  },
}
</script>
