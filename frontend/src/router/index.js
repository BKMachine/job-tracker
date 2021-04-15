import Customers from '@/views/Customers'
import Home from '@/views/Home.vue'
import Inventory from '@/views/Inventory'
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
