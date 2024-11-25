<script setup lang="ts">
import { Player } from '@/types';
import { api } from '@/server/api';
import { onBeforeMount, ref } from 'vue';
import { NAvatar } from 'naive-ui';

const players = ref<Player[]>([]);
onBeforeMount(async () => {
  players.value = await api.getAllPlayers();
});
</script>
<template>
  <div class="content">
    <h1>Who's playing?</h1>
    <div class="players">
      <div
        v-for="player in players"
        :key="player.id"
        style="text-align: center"
      >
        <n-avatar round :size="60" :src="player.avatarUrl" />
        {{ player.name }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.content {
  position: absolute;
  left: 50%;
  top: 40%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: white;
}

h1 {
  margin-bottom: 40px;
  text-align: center;
}

.players {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
  transition: width 0.3s ease;
}
</style>
