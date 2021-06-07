import Customers from '@/views/Customers'
import Home from '@/views/Home.vue'
import Job from '@/views/Job'
import Jobs from '@/views/Jobs'
import Part from '@/views/Part'
import Parts from '@/views/Parts'
import Settings from '@/views/Settings'
import Stock from '@/views/Stock'
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
    path: '/parts',
    name: 'parts',
    component: Parts,
  },
  {
    path: '/customers',
    name: 'customers',
    component: Customers,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },

  { path: '/jobs', name: 'jobs', component: Jobs },
  { path: '/job/:id', name: 'job', component: Job },
  { path: '/part/:id', name: 'part', component: Part },

  { path: '/part/:id/stock', name: 'stock', component: Stock },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
