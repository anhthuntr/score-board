<script setup lang="ts">
import { ref } from 'vue';
import { VAppBarNavIcon, VAppBarTitle } from 'vuetify/lib/components/index.mjs';

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>
<template>
  <div>
    <div><h2 class="header">Mahjong</h2></div>
  </div>
</template>
<style scoped>
.header {
  font-weight: 700;
}
</style>
