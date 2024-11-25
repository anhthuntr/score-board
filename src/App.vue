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

const showMenu = ref(false);

const menuItems = ref([
  { name: 'Mahjong', link: '/mahjong' },
  { name: 'Tien Len', link: '' }
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
</style>
