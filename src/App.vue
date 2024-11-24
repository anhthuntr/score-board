<script setup lang="ts">
import { ref } from 'vue';
import { NConfigProvider, darkTheme, NMenu } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui';
import { colors } from './constants';

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="header"></div>
    <router-view />
  </n-config-provider>
</template>

<style>
.header {
  height: 5rem;
  background-color: v-bind('colors.dark');
}
</style>
