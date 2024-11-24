import { createWebHistory, createRouter } from 'vue-router';
import About from '@/views/About.vue';
import MahjongScores from '@/views/MahjongScores.vue';

const routes = [
  {
    path: '/mahjong',
    name: 'Mahjong',
    component: MahjongScores
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
