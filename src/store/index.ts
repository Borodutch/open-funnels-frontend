import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { UserStore } from './modules/user.module';
import { SnackbarStore } from './modules/snackbar.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    UserStore,
    SnackbarStore,
  },
  plugins: [
    createPersistedState({
      key: '__data',
      paths: ['UserStore.token', 'UserStore.logged'],
    }),
  ],
});
