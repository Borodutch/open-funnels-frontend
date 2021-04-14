import { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Funnels from '@/views/Funnels.vue';
import AddFunnel from '@/views/AddFunnel.vue';
import NotFound from '@/views/NotFound.vue';

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/funnels',
    name: 'Funnels',
    component: Funnels,
  },
  {
    path: '/new',
    name: 'AddFunnel',
    component: AddFunnel,
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];
