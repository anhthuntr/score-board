<script setup lang="ts">
import { Player } from '@/types';
import { api } from '@/server/api';
import { onBeforeMount, ref, watch } from 'vue';
import { NAvatar, NForm, NButton, useMessage } from 'naive-ui';
import router from '@/router';

const selectedPlayers = ref<Player[]>([]);
const players = ref<Player[]>([]);
const message = useMessage();

watch(
  selectedPlayers,
  (newPlayers) => {
    localStorage.setItem('currentPlayers', JSON.stringify(newPlayers));
  },
  { deep: true }
);

onBeforeMount(async () => {
  players.value = await api.getAllPlayers();
});

const togglePlayer = (player: Player) => {
  if (selectedPlayers.value.includes(player)) {
    selectedPlayers.value = selectedPlayers.value.filter((p) => p !== player);
  } else if (selectedPlayers.value.length < 4) {
    selectedPlayers.value.push(player);
  }
};

const checkAmount = () => {
  console.log(selectedPlayers.value);
  if (selectedPlayers.value.length !== 4) {
    message.error('Please select 4 players');
  } else {
    message.success('Ready to play!');
    localStorage.setItem(
      'currentPlayers',
      JSON.stringify(selectedPlayers.value)
    );
    router.push('/mahjong');
  }
};
</script>
<template>
  <div class="content">
    <h1>Who's playing?</h1>
    <div class="players">
      <div
        v-for="player in players"
        :key="player.id"
        class="player-card"
        :style="{
          cursor: 'pointer',
          transform: selectedPlayers.some((p) => p.id === player.id)
            ? 'translateY(-15px)'
            : ''
        }"
        @click="togglePlayer(player)"
      >
        <n-avatar round :size="60" :src="player.avatarUrl" />
        <div style="display: flex; justify-content: center; text-align: center">
          {{ player.name }}
        </div>
      </div>
    </div>
    <div class="btn-container">
      <n-button class="button" color="#dbf2ff" @click="checkAmount()">
        Mahjong
      </n-button>
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
</style>
