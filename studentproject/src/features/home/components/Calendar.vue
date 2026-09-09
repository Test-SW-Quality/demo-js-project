<script setup>
import { computed, onMounted, ref } from 'vue';
import { getMonthNameByIndex } from '@/utils/monthUtils.js';
import { abbreviatedWeekdays } from '@/utils/constants.js';
import Day from './Day.vue';
import { EventsApi } from '@/api/events.js';
import ViewModal from './ViewModal.vue';
import { useEventsStore } from '@/stores/events';

const showView = ref(false);
const currentEvent = ref({});
const handleOpen = (event) => {
  currentEvent.value = event;
  showView.value = true;
};
const handleClose = () => {
  showView.value = false;
};

const currentDate = ref(new Date());
const currentMonthIndex = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const eventsStore = useEventsStore();

const firstDayOfCurrentMonth = computed(() => new Date(currentYear.value, currentMonthIndex.value, 1).getDay());
const lastDateOfPreviousMonth = computed(() => new Date(currentYear.value, currentMonthIndex.value, 0).getDate());
const lastDateOfCurrentMonth = computed(() => new Date(currentYear.value, currentMonthIndex.value + 1, 0).getDate());
const firstDayOfNextMonth = computed(() => new Date(currentYear.value, currentMonthIndex.value + 1, 1).getDay());
const numberOfRows = computed(() =>
  Math.ceil((firstDayOfCurrentMonth.value + lastDateOfCurrentMonth.value + (7 - firstDayOfNextMonth.value)) / 7),
);

onMounted(async () => {
  try {
    const data = await EventsApi.getEvents();
    eventsStore.setEvents(data);
  } catch (error) {
    console.error(error);
  }
});

function calculateDayOfMonth(row, col) {
  return col - 1 + (row - 1) * 7 - firstDayOfCurrentMonth.value + 1;
}

function getDayOfMonth(row, col) {
  const dayOfMonth = calculateDayOfMonth(row, col);
  if (dayOfMonth <= 0) {
    return lastDateOfPreviousMonth.value + (col - firstDayOfCurrentMonth.value);
  } else if (dayOfMonth > lastDateOfCurrentMonth.value) {
    return dayOfMonth - lastDateOfCurrentMonth.value;
  } else {
    return dayOfMonth;
  }
}

function isInactive(row, col) {
  const dayOfMonth = calculateDayOfMonth(row, col);
  return dayOfMonth <= 0 || dayOfMonth > lastDateOfCurrentMonth.value;
}

function filterEventsByDate(date, row, col) {
  const dayOfMonth = calculateDayOfMonth(row, col);
  let month = currentMonthIndex.value;

  if (dayOfMonth <= 0) {
    month -= 1;
  } else if (dayOfMonth > lastDateOfCurrentMonth.value) {
    month += 1;
  }

  const today = new Date(currentYear.value, month, date);

  return eventsStore.allEvents.filter((event) => {
    const startDateTime = new Date(event.startDateTime);
    const endDateTime = new Date(event.endDateTime);
    return today.toDateString() >= startDateTime.toDateString() && today.toDateString() <= endDateTime.toDateString();
  });
}

function backToToday() {
  currentDate.value = new Date();
  currentMonthIndex.value = currentDate.value.getMonth();
  currentYear.value = currentDate.value.getFullYear();
}

function goToPreviousMonth() {
  if (currentMonthIndex.value === 0) {
    currentMonthIndex.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonthIndex.value -= 1;
  }
}

function goToNextMonth() {
  if (currentMonthIndex.value === 11) {
    currentMonthIndex.value = 0;
    currentYear.value += 1;
  } else {
    currentMonthIndex.value += 1;
  }
}
</script>

<template>
  <div class="flex justify-between mb-2">
    <div class="flex gap-4">
      <select v-model="currentMonthIndex" class="border border-black outline-none rounded-full px-2">
        <option v-for="(month, index) in Array.from({ length: 12 })" :key="month" :value="index">
          {{ getMonthNameByIndex(index) }}
        </option>
      </select>
      <select v-model="currentYear" class="border border-black outline-none rounded-full px-2">
        <option v-for="year in Array.from({ length: 11 }).map((_, index) => currentYear - 5 + index)" :key="year">
          {{ year }}
        </option>
      </select>
      <div class="flex gap-2">
        <button class="bg-white border border-black rounded-full w-[42px]" @click="goToPreviousMonth">&lt;</button>
        <button class="bg-white border border-black rounded-full w-[42px]" @click="goToNextMonth">&gt;</button>
      </div>
    </div>
    <button
      class="bg-[#DFEBF7] border border-black rounded-full px-14 py-2 font-bold hover:bg-[#ccdef1] transition-all duration-150"
      @click="backToToday"
    >
      Today
    </button>
  </div>
  <table class="w-full rounded-[44px] border-separate border-spacing-0">
    <thead>
      <tr>
        <th v-for="day in abbreviatedWeekdays" :key="day" class="p-4 text-center">
          {{ day }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="rowNumber in numberOfRows" :key="rowNumber">
        <td
          v-for="colNumber in 7"
          :key="colNumber"
          class="p-2 lg:p-3 xl:p-4"
          :class="{ 'bg-gray-300': isInactive(rowNumber, colNumber) }"
        >
          <Day
            :current-day="getDayOfMonth(rowNumber, colNumber)"
            :is-inactive="isInactive(rowNumber, colNumber)"
            :events="filterEventsByDate(getDayOfMonth(rowNumber, colNumber), rowNumber, colNumber)"
            @on-click-event="handleOpen"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <section v-if="showView">
    <ViewModal :event="currentEvent" @close="handleClose" />
  </section>
</template>

<style scoped>
/** Code from: https://stackoverflow.com/a/4785917 */
table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: 350px;
  table-layout: fixed;
}

table tr th {
  height: 44px;
  background: #eee;
  border-top: solid 1px black;
}

table tr td {
  height: 144px;
  max-height: 144px;
}

table tr th,
table tr td {
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  width: 14.2857143%;
}

table tr th:first-child,
table tr td:first-child {
  border-left: 1px solid black;
}

/* top-left border-radius */
table tr:first-child th:first-child {
  border-top-left-radius: 44px;
}

/* top-right border-radius */
table tr:first-child th:last-child {
  border-top-right-radius: 44px;
}

/* bottom-left border-radius */
table tr:last-child td:first-child {
  border-bottom-left-radius: 44px;
}

/* bottom-right border-radius */
table tr:last-child td:last-child {
  border-bottom-right-radius: 44px;
}
</style>
@/api/event.js
