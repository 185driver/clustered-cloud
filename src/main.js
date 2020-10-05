import Vue from 'vue';
import 'roboto-fontface/css/roboto/sass/roboto-fontface.scss';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import '@/registerServiceWorker';
import App from '@/App';
import vueHeadful from 'vue-headful';

Vue.component('VueHeadful', vueHeadful);

Vue.config.productionTip = false;

// Allows use of vue-devtools in staging builds (dev-build) just like localhost.
Vue.config.devtools = (process.env.BASE_URL !== process.env.VUE_APP_PROD_URL);

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
