<!-- eslint-disable vue/multi-word-component-names -->
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
    <h1>Who's broke?</h1>
    <div class="players">
      <div v-for="player in players" :key="player.id" class="player-card">
        <n-avatar round :size="60" :src="player.avatarUrl" />
        <div style="display: flex; justify-content: center">
          {{ player.name }}
        </div>
        <div
          style="
            display: flex;
            justify-content: center;
            font-weight: bolder;
            font-size: large;
            margin-top: 10px;
          "
          :style="{ color: player.color }"
        >
          ${{ (player.totalPoints ?? 0) / 10 }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content {
  position: absolute;
  left: 50%;
  top: 50%;
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
.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
.points {
  display: flex;
  justify-content: center;
}
</style>
