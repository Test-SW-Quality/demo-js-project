<script setup>
import { ref, computed, watchEffect, watch } from 'vue';
import { getMonthNameByIndex } from '@/utils/monthUtils';
import ListLabel from './ListLabel.vue';
import Card from './Card.vue';
import { EventsApi } from '@/api/events.js';
import { useEventsStore } from '@/stores/events';

// defineProps({
//   allEvents: {
//     type: Array,
//     required: true,
//   },
// })

const currentDate = ref(new Date());
const currentDay = ref(currentDate.value.getDate());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const currentMonthName = computed(() => getMonthNameByIndex(currentMonth.value));

// const currentDateTest = '2024-03-04'; //FOR TESTING
const store = useEventsStore();
const allEvents = ref(store.allEvents);

function checkCurrentDate(items) {
  const formattedDate = currentDate.value.toISOString().split('T')[0];
  return items.filter((item) => item.startDateTime.includes(formattedDate));
}

watch(
  () => store.allEvents,
  (newVal) => {
    allEvents.value = checkCurrentDate(newVal);
  },
);

watchEffect(async () => {
  // const formattedDate = currentDateTest; //TEST
  const items = await EventsApi.getEvents();
  const eventCurrentDates = checkCurrentDate(items);

  if (eventCurrentDates.length > 0) {
    eventCurrentDates.forEach((eventCurrentDate) => {
      allEvents.value.push(eventCurrentDate);
    });
  }
});
</script>

<template>
  <div class="flex justify-center mt-10 border-separate border-spacing-0 mb-4">
    <div class="grid grid-cols-3 w-full h-40 bg-sky-blue rounded-3xl border border-black">
      <div class="flex justify-center items-center">
        <div class="text-6xl font-bold">
          <h1>{{ currentDay }}</h1>
        </div>
        <div class="px-5 font-bold">
          <div>
            <h2 class="text-2xl">{{ currentMonthName }}</h2>
          </div>
          <div>
            <h3 class="text-xl">{{ currentYear }}</h3>
          </div>
        </div>
      </div>
      <div class="flex flex-col col-span-2 justify-center">
        <div class="h-28 pr-10 overflow-auto">
          <ListLabel :events="allEvents">
            <template #list="{ item }">
              <Card :event="item" />
            </template>
          </ListLabel>
          <!-- <ListLabel :events="events">
          <template v-slot:list="{ item }">
            <Card :event="item" />
          </template>
        </ListLabel> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
div * {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: none !important;
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    width: 3px !important;
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
}
</style>
@/api/event.js