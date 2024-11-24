<script setup lang="ts">
import { ref } from 'vue';
import {
  NForm,
  NFormItem,
  FormInst,
  NButton,
  NRadioGroup,
  NRadioButton,
  NRadio
} from 'naive-ui';
import { User } from '@/types';
import { scoreRates } from '@/constants';

const players: User[] = [
  { id: 1, name: 'Nghi', color: 'green' },
  { id: 2, name: 'Thu', color: 'black' },
  { id: 3, name: 'Giang', color: 'grey' },
  { id: 4, name: 'Hang', color: 'purple' }
];

interface MahjongForm {
  winnerId?: number;
  scores?: number;
  isSelfDrawn: boolean;
  discardId?: number;
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
      // message.success('Valid');
    } else {
      console.log(errors);
      // message.error('Invalid');
    }
  });
};
</script>
<template>
  <div>
    <div class="header">
      <h2 class="header-title">Mahjong Scores</h2>
      <span class="header-subtitle">Current players</span>
      <div class="players">
        <div
          v-for="player in players"
          :key="player.id"
          class="player"
          :style="{ backgroundColor: player.color }"
        >
          {{ player.name }}
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
          <n-radio-group
            v-model:value="formValue.winnerId"
            name="left-size"
            size="large"
            style="width: 100%"
          >
            <n-radio-button
              v-for="player in players"
              :key="player.id"
              :value="player.id"
              style="width: 25%"
            >
              {{ player.name }}
            </n-radio-button>
          </n-radio-group>
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
        <div>Winner: Player Nghi</div>
        <div>Nghi: +8</div>
        <div>Thu: -8</div>
        <div>Giang: -8</div>
        <div>Hang: -8</div>
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
}
.player {
  width: 100%;
  font-size: 14px;
  width: 4rem;
  margin-top: 0.25rem;
}
</style>
