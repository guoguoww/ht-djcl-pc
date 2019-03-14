import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "./plugins/axios";
import './registerServiceWorker'

import { format } from "./assets/js/tool";
import cookie from "./assets/js/cookie";

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.min.css';
Vue.use(VueAwesomeSwiper);

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import "../public/css/reset.css";
import "../public/css/icon/iconmoon.css";

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie
Date.prototype.format = format
process.env.NODE_ENV === 'production'?console.log=()=>{}:''

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
