<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Player } from '@/types';
import { api } from '@/server/api';
import { onBeforeMount, ref } from 'vue';
import { NAvatar, NButton, NDatePicker, useMessage } from 'naive-ui';
import { supabase } from '@/server/supabase';

const players = ref<Player[]>([]);
const playerSum = ref<Player[]>([]);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const message = useMessage();
const showSummary = ref(false);


const getSummary = async () => {
  if (startDate.value && endDate.value) {
    const startD = new Date(startDate.value);
    const endD = new Date(endDate.value);
    
    if (endD < startD)
      message.error("End Date can't be before Start Date");
    else {
      showSummary.value = true;
      try {
        const { data, error } = await supabase.rpc('get_summary_score_by_date_range', {
          start_date: startD,
          end_date: endD
        });

        if (error) {
          throw error;
        }
        console.log('Summary data:', data);
        playerSum.value = data;
      } catch (error) {
        message.error("Error fetching summary data: " + error.message);
      }
    }
    console.log(startD.toLocaleDateString(), endD.toLocaleDateString());
  } else {
    console.log('No date range selected');
    message.error("Please select date range");
  }
}

const getTotalAmount = (playerId) => {
  const playerSummary = playerSum.value?.find((p) => p.playerid === playerId);

  return playerSummary ? playerSummary.totalamount / 10 : 0;
}


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
        <div style="
            display: flex;
            justify-content: center;
            font-weight: bolder;
            font-size: large;
            margin-top: 10px;
          " :style="{ color: player.color }">
          ${{ (player.totalPoints ?? 0) / 10 }}
        </div>
      </div>
    </div>
    <div style="display:flex; justify-content: space-between; margin-top: 20%;">

      <n-date-picker v-model:value="startDate" type="date" style="width: 180px" placeholder="Start Date" clearable />
      <n-date-picker v-model:value="endDate" type="date" style="width: 180px" placeholder="End Date" clearable />
    </div>
    <div class="btn-container">
      <n-button class="button" color="#FF8484" @click="getSummary()">
        SUMMARY
      </n-button>
    </div>
    <div v-if="showSummary" class="players-summary">
      <div v-for="player in players" :key="player.id" class="player-card">
        <n-avatar round :size="60" :src="player.avatarUrl" />
        <div style="display: flex; justify-content: center">
          {{ player.name }}
        </div>
        <div style="
            display: flex;
            justify-content: center;
            font-weight: bolder;
            font-size: large;
            margin-top: 10px;
          " :style="{ color: player.color }">
          ${{ getTotalAmount(player.id) }} </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content {
  position: absolute;
  left: 50%;
  top: 45%;
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
}

.players-summary {
  display: flex;
  margin-top: 3rem;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.points {
  display: flex;
  justify-content: center;
}
</style>
