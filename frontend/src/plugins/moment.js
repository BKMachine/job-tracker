import moment from 'moment'
import Vue from 'vue'

const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

Vue.prototype.$moment = moment
