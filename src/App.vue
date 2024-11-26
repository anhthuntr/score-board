<script setup lang="ts">
import { ref } from 'vue';
import {
  NConfigProvider,
  darkTheme,
  NDrawer,
  NLayout,
  NLayoutHeader,
  NSpace,
  NButton,
  NEl,
  NMessageProvider
} from 'naive-ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { supabase } from '@/server/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref<User | null>(null);

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    user.value = null;
    router.push('/');
  }
};
const showMenu = ref(false);

const menuItems = ref([
  { name: 'Mahjong', link: '/mahjong' },
  { name: 'Tien Len', link: '' },
  { name: 'Balance', link: '/about' },
  { name: 'History', link: '/log' }
]);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-layout>
      <n-layout-header class="nav-bar">
        <n-space justify="space-between" class="nav-content">
          <n-el class="logo"><a href="/">Score Board</a></n-el>

          <n-button @click="toggleMenu">
            <font-awesome-icon icon="bars" />
          </n-button>
        </n-space>
      </n-layout-header>

      <!-- MENU -->
      <n-drawer
        v-model:show="showMenu"
        placement="right"
        style="margin-top: 3rem"
      >
        <n-button
          block
          v-for="item in menuItems"
          :key="item.name"
          @click="
            () => {
              showMenu = false;
              $router.push(item.link);
            }
          "
        >
          <n-el>{{ item.name }}</n-el>
        </n-button>
        <div class="logout">
          <button @click="logout" class="logout-button">Logout</button>
        </div>
      </n-drawer>
    </n-layout>

    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
.background {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  height: 3rem;
  background-color: black;
}

.nav-content {
  width: 100%;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.menu-btn {
  display: none;
}

.desktop-menu {
  display: flex;
  gap: 12px;
}
.logout {
  position: absolute;
  top: 93%;
  left: 35%;
}
.logout-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 7px 13px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #d9363e;
}
</style>
