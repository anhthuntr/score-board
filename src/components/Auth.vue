<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/server/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const user = ref<User | null>(null);
const errorMessage = ref('');

const router = useRouter();

const checkUser = async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    user.value = data.session.user;
    router.push('/lobby');
  } else {
    user.value = null;
  }
};

const login = async () => {
  isLoading.value = true;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    user.value = data.user;
    router.push('/lobby');
  }
  isLoading.value = false;
};

onMounted(() => {
  checkUser();
});
</script>

<template>
  <div class="login-container">
    <div v-if="!user" class="login-form">
      <h2>Who are you?</h2>
      <form @submit.prevent="login">
        <div>
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            class="input-field"
          />
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            required
            class="input-field"
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div>
          <button type="submit" :disabled="isLoading" class="submit-btn">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.login-form {
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #fafafa;
}

.input-field {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
}

.input-field:focus {
  outline: none;
  border-color: #4f7030;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4f7030;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #d6ffa0;
  cursor: not-allowed;
}

.submit-btn:hover:enabled {
  background-color: #4f7030;
}

.error-message {
  color: #ce2a1e;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
