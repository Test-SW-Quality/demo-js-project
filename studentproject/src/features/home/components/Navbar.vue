<script setup>
import { useAuth } from '@/composables/useAuth';
import UserIcon from '@/features/icons/userMaleCircle.svg';

const store = useAuth();

const handleLogout = async () => {
  await store.logout();
  window.location.reload();
};
</script>

<template>
  <nav class="bg-white border-b border-black">
    <div class="flex justify-between px-8 py-4">
      <div class="font-bold">2GOOD4U</div>
      <ul class="flex gap-4">
        <li>
          <p class="text-gray-500"></p>
        </li>
        <div class="dropdown dropdown-end h-6 w-6">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar h-6 min-h-[24px] w-6">
            <div class="h-6 w-6 rounded-full">
              <img alt="Tailwind CSS Navbar component" :src="UserIcon" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-black"
          >
            <li class="px-3 py-2 text-md">Hello, {{ store.activeUser.value.username }}</li>
            <li><a class="px-3 py-2 text-md underline" @click.prevent="handleLogout">Logout</a></li>
          </ul>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script setup></script>
