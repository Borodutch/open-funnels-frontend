import Vue from 'vue';
import App from './App.vue';
import router from './plugins/router';
import store from './store';
import vuetify from './plugins/vuetify';
import VuetifyConfirm from 'vuetify-confirm';

Vue.config.productionTip = false;

Vue.use(VuetifyConfirm, { vuetify });

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#__open-funnels');
