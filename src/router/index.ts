import { createWebHistory, createRouter } from 'vue-router';
import About from '@/views/About.vue';
import MahjongScores from '@/views/MahjongScores.vue';
import HomePage from '@/views/HomePage.vue';
import Auth from '@/components/Auth.vue';
import LogHistory from '@/views/LogHistory.vue';
import { supabase } from '@/server/supabase';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Auth
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/mahjong',
    name: 'Mahjong',
    component: MahjongScores,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'Counter',
    component: About,
    meta: { requiresAuth: true }
  },
  {
    path: '/log',
    name: 'Log',
    component: LogHistory,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
