import { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';

export const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      secured: true,
    },
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];
