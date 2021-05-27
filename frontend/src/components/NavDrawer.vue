<template>
  <v-navigation-drawer permanent app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          <v-avatar>
            <img src="@/assets/logo.png" alt="Logo" />
          </v-avatar>
          Job Tracker
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.route"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template slot="append">
      <v-list dense nav>
        <v-list-item link to="settings">
          <v-list-item-icon>
            <v-icon> mdi-cog-outline </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavDrawer',
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
        { title: 'Jobs', icon: 'mdi-barcode', route: '/jobs' },
        {
          title: 'Inventory',
          icon: 'mdi-format-list-bulleted',
          route: '/inventory',
        },
        {
          title: 'Customers',
          icon: 'mdi-account-multiple',
          route: '/customers',
        },
      ],
    }
  },
}
</script>

<style scoped></style>
