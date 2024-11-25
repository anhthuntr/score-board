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
      <h2 class="header-title">Mahjong Scores</h2>
      <div style="display: flex; justify-content: center; gap: 1rem">
        <span class="header-subtitle">Current players</span>

        <div class="players">
          <div v-for="player in players" :key="player.id">
            <n-avatar round size="medium" :src="player.avatarUrl" />
          </div>
        </div>
      </div>
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
          <n-radio-group
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
          </n-radio-group>
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
