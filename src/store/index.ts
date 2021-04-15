import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { UserStore } from './modules/user.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    UserStore,
  },
  plugins: [createPersistedState({ key: '__data' })],
});
