<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { supabase } from '@/server/supabase';
import { NDataTable } from 'naive-ui';
import { Player } from '@/types';
import { api } from '@/server/api';

const historyData = ref([]);
const players = ref<Player[]>([]);

interface PlayerData {
  name?: string;
  amount: number;
  playerId?: number;
}

interface GroupData {
  gameId?: number;
  gamedate?: Date;
  player_data: PlayerData[];
  winnerId?: number;
  discardId?: number;
}
interface Column {
  title: string;
  key: string;
  render?: (row: GroupData) => string | number;
}

const columns = ref<Column[]>([]);
const groupedData = ref<GroupData[]>([]);

onBeforeMount(async () => {
  const storedPlayers = localStorage.getItem('currentPlayers');
  if (storedPlayers) {
    const currentPlayers: Player[] = JSON.parse(storedPlayers);

    const fetchedPlayers = await api.getPlayerById(currentPlayers);
    if (fetchedPlayers && Array.isArray(fetchedPlayers)) {
      players.value = fetchedPlayers;
    }
  }

  const { data, error } = await supabase.rpc('get_record', { limit_rows: '15' });
  if (error) {
    console.error('Error fetching records:', error.message);
  } else {
    historyData.value = data;
    console.log(data);
  }

  groupedData.value = data.map((e: any) => {
    return {
      gameid: e.gameId,
      gameDate: e.gameDate,
      player_data: e.player_data,
      winnerid: e.winnerId,
      discardid: e.discardId
    };
  });

  // eslint-disable-next-line no-use-before-define
  updateColumns();
});

function updateColumns() {
  if (groupedData.value.length > 0) {
    columns.value = [
      {
        title: 'Game Date',
        key: 'gameDate',
        render(row: GroupData) {
          return row.gamedate
            ? new Date(row.gamedate).toLocaleDateString()
            : 'N/A';
        }
      },
      ...groupedData.value[0].player_data.map((player: PlayerData) => ({
        title: `${player.name}`,
        key: `player_${player.playerId}`,
        render(row: GroupData) {
          return (
            row.player_data.find(
              (p: PlayerData) => p.playerId === player.playerId
            )?.amount || 0
          );
        }
      }))
    ];
  }
}

watch(
  players,
  () => {
    updateColumns();
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="content">
    <h3>History</h3>
  </div>
  <n-data-table :columns="columns" :data="historyData" />
</template>
<style scoped>
.content {
  position: absolute;
  left: 3%;
  top: 7%;
}

h3 {
  color: white;
}
</style>