<script setup>
  import { ref, reactive } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { encrypt, validatePassword } from '@/utils/pswdUtils';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const store = useAuth();
  const credentials = reactive({ username: '', password: '' });
  const isRegistering = ref(false);
  const error = ref('');

  const handleLogin = async () => {
    try {
      await store.login(
        credentials.username,
        encrypt('THIS IS ENCRYPTING', credentials.password)
      );
      credentials.username = '';
      credentials.password = '';
      router.push('/home');
    } catch (e) {
      error.value = e.message;
    }
  };

  const handleRegister = async () => {
    try {
      if (validatePassword(credentials.password)) {
        error.value = validatePassword(credentials.password).join('\n');
        return;
      } else {
        await store.register(
          credentials.username,
          encrypt('THIS IS ENCRYPTING', credentials.password)
        );
        credentials.username = '';
        credentials.password = '';
        error.value = 'Register successful! Please login to continue';
      }
    } catch (e) {
      error.value = e.message;
    }
  };

  const toggleRegistering = () => {
    isRegistering.value = !isRegistering.value;
    error.value = '';
  };
</script>

<template>
  <div class="fixed w-full h-full">
    <div
      v-if="store.user"
      class="absolute top-4 left-4 bg-white border p-4 rounded-md"
    >
      <h2 class="font-bold">User Information</h2>
      <p><strong>Username:</strong> {{ store.user.username }}</p>
      <p>
        <strong>Status:</strong>
        {{ store.user.isActive ? 'Active' : 'Inactive' }}
      </p>
    </div>
    <div
      class="relative w-full md:w-[440px] h-full md:h-[320px] px-4 md:px-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    >
      <div class="bg-white rounded-3xl border border-black w-full md:h-full">
        <div class="p-8 pb-0">
          <h1 class="text-2xl font-bold">
            {{ isRegistering ? 'Register' : 'Login' }}
          </h1>
          <p v-if="!isRegistering">Please login to continue</p>
          <p v-else>Please register to create an account</p>
        </div>
        <form
          class="flex flex-col justify-between gap-4 p-8 pt-5"
          @submit.prevent="isRegistering ? handleRegister() : handleLogin()"
        >
          <input
            v-model="credentials.username"
            type="text"
            placeholder="Username"
            autocomplete="username"
            class="outline-none bg-[#EBEBEB] px-6 py-3 rounded-2xl"
            required
          />
          <input
            v-model="credentials.password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            class="outline-none bg-[#EBEBEB] px-6 py-3 rounded-2xl"
            required
          />
          <div class="flex gap-3">
            <button
              type="button"
              class="w-1/2 border border-black rounded-full p-2 text-[#999999]"
              @click="toggleRegistering"
            >
              {{ isRegistering ? 'Go to Login' : 'Go to Register' }}
            </button>
            <button
              type="submit"
              class="w-1/2 border border-black rounded-full p-2 bg-[#768A95] text-white"
            >
              {{ isRegistering ? 'Register' : 'Login' }}
            </button>
          </div>
        </form>
        <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
