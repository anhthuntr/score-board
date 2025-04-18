<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import {
  NForm,
  NFormItem,
  FormInst,
  NButton,
  NRadioGroup,
  NRadioButton,
  NRadio,
  NAvatar,
  NAlert,
  NCard,
  useMessage
} from 'naive-ui';
import { Game, Player, PlayerGame } from '@/types';
import { GameType, scoreRates } from '@/constants';
import { api } from '@/server/api';
import { useRouter } from 'vue-router';

const players = ref<Player[]>([]);
const message = useMessage();

const playerScores = ref<PlayerGame[]>([]);

interface MahjongForm {
  winnerId?: number;
  scores?: number;
  // isSelfDrawn: boolean;
  winType: 'Self Drawn' | 'Discard' | 'Pay All';
  discardId?: number;
}

const formRef = ref<FormInst | null>(null);
const formValue = ref<MahjongForm>({ winType: 'Self Drawn' });
const rules = {
  winnerId: {
    required: true,
    message: 'Please select a winner'
  },
  scores: {
    required: true,
    message: 'Please input the score'
  },
  discardId: {
    required: formValue.value.winType !== 'Self Drawn',
    message: 'Please select a discarder'
  }
};

const calculateScores = () => {
  const { winnerId, scores, winType, discardId } = formValue.value;

  const loseValue =
    ((winType === 'Discard' ? scores : (scores || 0) / 2) ?? 0) * -1;
  const winValue =
    (winType === 'Discard' ? scores : ((scores || 0) * 3) / 2) ?? 0;

  const newGame: Game = {
    winnerId,
    scoreValue: scores,
    type: GameType.Mahjong,
    discardId: winType === 'Self Drawn' ? undefined : discardId
  };
  const playerGames = players.value.map((i) => {
    const isWinning = i.id === winnerId;
    const isDiscarding = i.id === discardId;
    let amount = 0;
    if (isWinning) {
      // is winner
      amount = winValue;
    } else if (
      (isDiscarding && winType === 'Discard') ||
      (!isWinning && winType === 'Self Drawn')
    ) {
      // is discarder OR lose in self drawn
      amount = loseValue;
    } else if (!isWinning && winType === 'Discard' && !isDiscarding) {
      // is NOT a discarder
      amount = 0;
    } else if (winType === 'Pay All' && isDiscarding) {
      // is discarder in self drawn pay all
      amount = loseValue * 3;
    }

    return { amount, playerId: i.id };
  });

  playerScores.value = playerGames;

  return { game: newGame, playerGames };
};

const addGame = async () => {
  const newGame = calculateScores();

  await api.addMahjongScores(newGame.game, newGame.playerGames);

  await api.updatePlayersPoints(
    players.value.map((i) => ({
      playerId: i.id ?? 0,
      points: playerScores.value.find((s) => s.playerId === i.id)?.amount ?? 0
    }))
  );

  const fetchedPlayers = await api.getPlayerById(players.value);
  if (fetchedPlayers && Array.isArray(fetchedPlayers)) {
    players.value = fetchedPlayers;
  }

  formValue.value = { winType: 'Self Drawn' };
  formRef.value?.restoreValidation();
  const router = useRouter();
  router.go(0);
};

const validateInput = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    // eslint-disable-next-line no-empty
    if (!errors) {
      addGame();
    } else {
      console.log(errors);
    }
  });
};

onBeforeMount(async () => {
  const storedPlayers = localStorage.getItem('currentPlayers');
  if (storedPlayers) {
    const currentPlayers: Player[] = JSON.parse(storedPlayers);

    const fetchedPlayers = await api.getPlayerById(currentPlayers);
    if (fetchedPlayers && Array.isArray(fetchedPlayers)) {
      players.value = fetchedPlayers;
    }
  }
});

watch(
  () => formValue.value,
  () => {
    const { winnerId, scores } = formValue.value;
    if (winnerId && scores) {
      calculateScores();
    }
  },
  { deep: true, immediate: true }
);
</script>
<template>
  <div>
    <div class="header">
      <h2 class="header-title">🀄Mahjong Scores🀄</h2>
    </div>
    <div class="background">
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :size="'large'"
      >
        <n-form-item label="Winner" path="winnerId">
          <n-card
            v-for="player in players"
            :key="player.id"
            class="player-card"
            hoverable
            :style="{
              backgroundColor:
                formValue.winnerId === player.id ? player.color : ''
            }"
            :content-style="{ padding: '1rem' }"
            @click="formValue.winnerId = player.id"
          >
            <n-avatar round size="large" :src="player.avatarUrl" />
            <div
              style="font-size: 13px"
              :style="{
                color: formValue.winnerId === player.id ? 'black' : 'white'
              }"
            >
              {{ player.name }}
            </div>
          </n-card>
        </n-form-item>
        <n-form-item label="Score" path="scores">
          <div class="container">
            <div
              class="tile"
              v-for="rate in scoreRates"
              :key="rate.baseValue"
              :value="rate.baseValue"
              :class="{ selected: formValue.scores === rate.baseValue }"
              @click="formValue.scores = rate.baseValue"
            >
              {{ rate.label }}
            </div>
          </div>
        </n-form-item>
        <n-form-item label="Win By">
          <n-radio-group
            v-model:value="formValue.winType"
            size="large"
            style="width: 100%"
          >
            <n-radio-button
              :value="'Self Drawn'"
              :label="'Self Drawn'"
              style="width: 33%"
            />
            <n-radio-button
              :value="'Discard'"
              :label="'Discard'"
              style="width: 33%"
            />
            <n-radio-button
              :value="'Pay All'"
              :label="'Pay All'"
              style="width: 33%"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="Discarded By"
          path="discardId"
          v-if="formValue.winType !== 'Self Drawn'"
        >
          <n-card
            v-for="player in players"
            :key="player.id"
            :hoverable="formValue.winnerId !== player.id"
            :style="{
              backgroundColor:
                formValue.discardId === player.id
                  ? player.color
                  : formValue.winnerId === player.id
                  ? '#30303077'
                  : ''
            }"
            class="player-card"
            :content-style="{ padding: '1rem' }"
            @click="
              if (player.id !== formValue.winnerId)
                formValue.discardId = player.id;
            "
          >
            <n-avatar round size="large" :src="player.avatarUrl" />
            <div
              style="font-size: 13px"
              :style="{
                color: formValue.discardId === player.id ? 'black' : 'white'
              }"
            >
              {{ player.name }}
            </div>
          </n-card>
        </n-form-item>
        <n-form-item>
          <n-button @click="validateInput" block type="primary" strong>
            Add Mahjong Score
          </n-button>
        </n-form-item>
      </n-form>

      <div style="color: white; display: flex; gap: 2rem">
        <div>
          <div>
            Winner:
            {{ players.find((i) => i.id === formValue.winnerId)?.name }}
          </div>
          <div>
            Discard:
            {{ players.find((i) => i.id === formValue.discardId)?.name }}
          </div>
        </div>
        <div style="display: flex; gap: 1rem; text-align: center">
          <div v-for="player in playerScores" :key="player.id">
            <span>
              {{ players.find((i) => i.id === player.playerId)?.name }}
            </span>
            <div>
              {{ player.amount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}

.tile {
  box-sizing: border-box;
  font-weight: bolder;
  font-size: 24px;
  width: 1.5em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  background: #f8f1ea;
  border-radius: 0.125em;
  border: 1px solid #999;
  position: relative;
  box-shadow: 0.1em 0.1em 0px 0px #999, 0.2em 0.2em 0px 0px #963;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
  /* color: #333; */
  color: rgb(58, 54, 54);
  padding-left: 2px;
  /* text-shadow: -1px 0px 0px green, 1px 1px 0px #fff; */
}

.tile:hover,
.tile:active {
  transform: translateY(-5px);
}

.tile.selected {
  transform: translateY(-5px);
  background-color: #d6a274;
}

@media (max-width: 480px) {
  .container {
    gap: 0.9em;
  }
}

.header-title {
  font-weight: 700;
  font-size: 32px;
  text-align: center;
}
.header {
  margin: 1rem;
  color: white;
  text-align: center;
}
.header-subtitle {
  text-align: center;
  color: grey;
}
.players {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
}
.player-card {
  text-align: center;
}
/* .player-card:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
} */
</style>
