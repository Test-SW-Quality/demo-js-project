<script setup>
import BackArrow from '../icons/backArrow.svg';
import ClockIcon from '../icons/clock.svg';
import DescriptionIcon from '../icons/desc.svg';
import LocationIcon from '../icons/pin.svg';
import { computed, onMounted, ref, watch } from 'vue';
import { EventsApi } from '@/api/events.js';
import { useRoute, useRouter } from 'vue-router';
import { ignoreTimezoneIso } from '@/utils/timeUtils';
const { params } = useRoute();
const router = useRouter();
const currentEvent = ref({});

onMounted(async () => {
  try {
    const event = await EventsApi.getEventById(params.id);
    currentEvent.value = event;
  } catch (error) {
    console.error(error);
  }
});

const date = ref(new Date());
const dateInput = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const errorMessage = computed(() => (startDateTime.value >= endDateTime.value ? '**Time is in valid' : ''));

watch(currentEvent, () => {
  date.value = new Date(currentEvent.value.startDateTime ?? '');
  const isoStartDateTime = ignoreTimezoneIso(date.value);
  const isoEndDateTime = ignoreTimezoneIso(new Date(currentEvent.value.endDateTime));
  const splitedStartDateString = isoStartDateTime.split('T');
  const splitedEndDateString = isoEndDateTime.split('T');

  dateInput.value = splitedStartDateString[0];

  startDateTime.value = splitedStartDateString[1].slice(0, 5);
  endDateTime.value = splitedEndDateString[1].slice(0, 5);
});

const updateEvent = async () => {
  try {
    await EventsApi.updateEvent({
      ...currentEvent.value,
      startDateTime: `${dateInput.value}T${startDateTime.value}:00`,
      endDateTime: `${dateInput.value}T${endDateTime.value}:00`,
    });
    router.push({ name: 'Home' });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="bg-[#E6E6E6]">
    <router-link to="/home">
      <button class="flex absolute left-[50px] top-[40px] z-[999]">
        <img :src="BackArrow" alt="BackArrow" class="w-[40px] h-[40px] opacity-50" />
      </button>
    </router-link>
    <div class="fixed inset-0 flex items-center justify-center">
      <div class="bg-white rounded-3xl w-[50vw] border border-black">
        <header class="bg-[rgb(170,199,216)] rounded-t-3xl border border-b-black">
          <h1 class="p-8 text-xl font-bold">
            <input
              v-model="currentEvent.title"
              type="text"
              class="focus:outline-none focus:border-b focus:border-black bg-transparent"
            />
          </h1>
        </header>
        <div>
          <div class="p-10">
            <div class="flex flex-col gap-2">
              <div class="flex items-center pt-2">
                <div class="flex self-start pt-[2px]">
                  <img :src="ClockIcon" width="21" />
                </div>
                <!-- date -->
                <div class="pl-3 flex flex-col gap-2">
                  <input v-model="dateInput" type="date" required onfocus="this.showPicker()" />

                  <div class="flex">
                    <div class="border-b border-t-0 border-l-0 border-r-0 border-gray-300">
                      <input v-model="startDateTime" type="time" required onfocus="this.showPicker()" />
                    </div>
                    <div>&nbsp;&nbsp;-&nbsp;&nbsp;</div>
                    <div class="border-b border-t-0 border-l-0 border-r-0 border-gray-300">
                      <input v-model="endDateTime" type="time" required onfocus="this.showPicker()" />
                    </div>
                  </div>
                  <p v-if="errorMessage" class="text-red-600 opacity-75 text-sm font-bold">
                    {{ errorMessage }}
                  </p>
                </div>
              </div>
              <div class="pl-3"></div>
            </div>
            <!-- locate -->
            <div class="flex gap-4 mt-7 items-start">
              <img :src="LocationIcon" alt="LocationIcon" width="21" />
              <div class="border-b border-t-0 border-l-0 border-r-0 border-gray-300">
                <input
                  v-model="currentEvent.location"
                  type="text"
                  class="focus:outline-none focus:border-b focus:border-black"
                />
              </div>
            </div>
            <div class="flex gap-4 mt-7 items-start">
              <img :src="DescriptionIcon" alt="DescriptionIcon" width="21" />
              <textarea v-model="currentEvent.description" class="textarea w-[70vw] h-[8rem] itim drop-shadow-md">
              </textarea>
            </div>
            <div class="grid grid-cols-2 gap-4 p-5 py-6 pb-4 justify-items-center w-full">
              <router-link :to="{ name: 'Home' }">
                <button class="btn btn-wide p-3 border border-black rounded-full text-[#999999]">
                  Cancel
                </button></router-link
              >

              <button
                class="btn btn-wide p-3 border border-black rounded-full bg-[#768A96] text-white hover:bg-[#768A96]"
                :disabled="!!errorMessage"
                @click.prevent="updateEvent"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* input[type='date']::-webkit-inner-spin-button,
input[type='date']::-webkit-calendar-picker-indicator, */
input[type='time']::-webkit-inner-spin-button,
input[type='time']::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
