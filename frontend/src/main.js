import VueFormulate from '@braid/vue-formulate'
import Vue from 'vue'
import Toasted from 'vue-toasted'
import App from './App.vue'
import s3Uploader from './plugins/s3_uploader'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import {} from './plugins/axios'
import {} from './plugins/moment'

Vue.config.productionTip = false

Vue.use(VueFormulate, {
  // Use API Gateway URL + route path 😉
  uploadUrl: process.env.VUE_APP_UPLOAD_URL,
  plugins: [s3Uploader],
})

Vue.use(Toasted)

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
