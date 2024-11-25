<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
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
  NCard
} from 'naive-ui';
import { Player } from '@/types';
import { scoreRates } from '@/constants';
import { api } from '@/server/api';

const players = ref<Player[]>([]);

interface MahjongForm {
  winnerId?: string;
  scores?: number;
  isSelfDrawn: boolean;
  discardId?: string;
}

const formRef = ref<FormInst | null>(null);
const formValue = ref<MahjongForm>({ isSelfDrawn: false });
const rules = {
  winnerId: {
    required: true,
    message: 'Please select a winner'
  },
  scores: {
    required: true,
    message: 'Please input the score'
  }
};
const addScore = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    // eslint-disable-next-line no-empty
    if (!errors) {
    } else {
      console.log(errors);
      // message.error('Invalid');
    }
  });
};

onBeforeMount(async () => {
  players.value = await api.getAllPlayers();
});
</script>
<template>
  <div>
    <div class="header">
      <h2 class="header-title">🀄Mahjong Scores🀄</h2>
      <!-- <div style="display: flex; justify-content: center; gap: 1rem">
        <span class="header-subtitle">Current players</span>

        <div class="players">
          <div v-for="player in players" :key="player.id">
            <n-avatar round size="medium" :src="player.avatarUrl" />
          </div>
        </div>
      </div> -->
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
            hoverable
            :style="{
              backgroundColor:
                formValue.winnerId === player.id ? player.color : '',
              textAlign: 'center'
            }"
            :content-style="{ padding: '1rem' }"
            @click="formValue.winnerId = player.id"
          >
            <n-avatar round size="large" :src="player.avatarUrl" />
            <div
              :style="{
                color: formValue.winnerId === player.id ? 'black' : 'white'
              }"
            >
              {{ player.name }}
            </div>
          </n-card>
        </n-form-item>
        <n-form-item label="Score" path="scores">
          <!-- <n-radio-group
            v-model:value="formValue.scores"
            size="large"
            style="width: 100%"
          >
            <n-radio-button
              v-for="rate in scoreRates"
              :key="rate.baseValue"
              :value="rate.baseValue"
              style="
                width: calc(100% / 6);
                text-align: center;
                padding-left: 5px;
              "
            >
              {{ rate.label }}
            </n-radio-button>
          </n-radio-group> -->
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
            v-model:value="formValue.isSelfDrawn"
            size="large"
            style="display: flex; flex-direction: column; gap: 1rem"
          >
            <n-radio :value="true" :label="'Self Drawn'" />
            <n-radio :value="false" :label="'Discard'" />
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="Discarded By"
          path="discardId"
          v-if="!formValue.isSelfDrawn"
        >
          <n-radio-group
            v-model:value="formValue.discardId"
            size="large"
            style="width: 100%"
          >
            <n-radio-button
              v-for="player in players"
              :key="player.id"
              :value="player.id"
              style="width: 25%"
              :disabled="player.id === formValue.winnerId"
            >
              {{ player.name }}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item>
          <n-button @click="addScore" block type="primary" strong>
            Add Mahjong Score
          </n-button>
        </n-form-item>
      </n-form>

      <div style="color: white">
        <div>
          Winner: Player
          {{ players.find((i) => i.id === formValue.winnerId)?.name }}
        </div>
        <div v-for="player in players" :key="player.id">
          <span style="width: 5rem">{{ player.name }}</span>
          <span style="width: 5rem">{{}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  font-size: 200%;
  display: flex;
  justify-content: space-around;
  gap: 1em;
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
  transition: width 0.3s ease, font-size 0.3s ease;
}

.tile:hover,
.tile:active {
  transform: translateY(-5px);
}

.tile.selected {
  transform: translateY(-5px);
  background-color: #d6a274;
}

@media (max-width: 768px) {
  .tile {
    font-size: 18px;
    width: 2.5em;
    height: 3.33em;
    line-height: 3.33em;
  }
  .container {
    gap: 0.6em;
  }
}

@media (max-width: 480px) {
  .tile {
    font-size: 14px;
  }

  .container {
    gap: 0.4em;
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
</style>
