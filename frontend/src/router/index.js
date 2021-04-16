import Customers from '@/views/Customers'
import Home from '@/views/Home.vue'
import Inventory from '@/views/Inventory'
import Job from '@/views/Job'
import Jobs from '@/views/Jobs'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: Inventory,
  },
  {
    path: '/customers',
    name: 'customers',
    component: Customers,
  },

  { path: '/jobs', name: 'jobs', component: Jobs },
  { path: '/job/:id', name: 'job', component: Job },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
