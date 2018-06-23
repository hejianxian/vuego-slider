import Vue from 'vue'
import App from './App.vue'
import VuegoSlider from './install.js';

Vue.use(VuegoSlider);

new Vue({
  el: '#app',
  render: h => h(App)
})
