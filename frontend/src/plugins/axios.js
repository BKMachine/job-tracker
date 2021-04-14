import { baseUrl } from '@/config'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import Vue from 'vue'

const instance = axios.create({
  baseURL: baseUrl,
})

axiosRetry(instance, { retries: 3 })

Vue.prototype.$http = instance
Vue.prototype.$axios = instance

export default instance
