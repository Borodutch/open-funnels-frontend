import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './routes';
import store from '@/store/index';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(
      (record) => record.meta.secured && !store.state.UserStore.logged
    )
  ) {
    next('/login');
  } else {
    next();
  }
});

export default router;
