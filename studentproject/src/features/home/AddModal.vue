<script setup>
  import { ref } from 'vue';
  import { EventsApi } from '@/api/events.js';
  import DatePicker from './DatePicker.vue';
  import Plus from '../icons/plus.svg';
  import { MONTH_NAMES } from '@/utils/constants.js';
  import { useAuth } from '@/composables/useAuth';

  const store = useAuth();
  const eventTitle = ref('');
  const selectedDate = ref('');
  const firstTimeStamp = ref('');
  const secondTimeStamp = ref('');
  const isNextDay = ref(false);
  const eventLocation = ref('');
  const eventDescription = ref('');
  const showModal = ref(false);

  const errorStatus = ref(false);
  const errorMessages = ref({
    title: 'Title',
    date: 'Date',
    firstTimeStamp: 'First Time Stamp',
    secondTimeStamp: 'Second Time Stamp',
    location: 'Location',
    description: 'Description',
  });

  const emit = defineEmits(['isModalOpen']);

  const handleOpenModal = () => {
    showModal.value = true;
    emit('isModalOpen', showModal.value);
  };

  const handleCloseModal = () => {
    showModal.value = false;
    emit('isModalOpen', showModal.value);
  };

  const formatDateTime = (date, time) => {
    const dateParts = date.split(' ');
    const monthNames = MONTH_NAMES;
    const monthName = dateParts[1].replace(',', '');
    const monthNumber = monthNames.indexOf(monthName) + 1;
    const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    const formattedDate = `${
      dateParts[2]
    }-${formattedMonth}-${dateParts[0].padStart(2, '0')}`;
    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0]).toString().padStart(2, '0');
    const minute = timeParts[1].split(' ')[0];
    const period = timeParts[1].split(' ')[1];
    const formattedHour = period === 'AM' ? hour : parseInt(hour) + 12;
    const formattedTime = `${formattedHour}:${minute}:00`;

    return `${formattedDate}T${formattedTime}`;
  };

  const handleAddEvent = () => {
    errorStatus.value = false;
    if (eventTitle.value.length === 0) {
      errorStatus.value = true;
      errorMessages.value = 'Title';
      return;
    }
    if (selectedDate.value === 'Select Date') {
      errorStatus.value = true;
      errorMessages.value = 'Date';
      return;
    }
    if (firstTimeStamp.value === '') {
      errorStatus.value = true;
      errorMessages.value = 'First Time Stamp';
      return;
    }
    if (secondTimeStamp.value === '') {
      errorStatus.value = true;
      errorMessages.value = 'Second Time Stamp';
      return;
    }
    if (eventLocation.value === '') {
      errorStatus.value = true;
      errorMessages.value = 'Location';
      return;
    }
    if (eventDescription.value === '') {
      eventDescription.value = 'none';
    }

    firstTimeStamp.value = formatDateTime(
      selectedDate.value,
      firstTimeStamp.value
    );
    secondTimeStamp.value = formatDateTime(
      selectedDate.value,
      secondTimeStamp.value
    );

    if (isNextDay.value) {
      const firstDayEvent = {
        title: eventTitle.value,
        description: eventDescription.value,
        location: eventLocation.value,
        startDateTime: firstTimeStamp.value,
        endDateTime: firstTimeStamp.value.split('T')[0] + 'T23:59:59',
        owner: store.activeUser.value.id,
      };

      const dateObject = secondTimeStamp.value.split('T')[0].split('-');
      const date = new Date(dateObject[0], dateObject[1] - 1, dateObject[2]);
      date.setDate(date.getDate() + 1);
      const formattedDate = formatDateTime(
        `${date.getDate()} ${
          MONTH_NAMES[date.getMonth()]
        }, ${date.getFullYear()}`,
        secondTimeStamp.value.split('T')[1]
      );

      const secondDayEvent = {
        title: eventTitle.value,
        description: eventDescription.value,
        location: eventLocation.value,
        startDateTime: formattedDate.split('T')[0] + 'T00:00:00',
        endDateTime: formattedDate,
        owner: store.activeUser.value.id,
      };

      EventsApi.addEvent(firstDayEvent);
      EventsApi.addEvent(secondDayEvent);
      isNextDay.value = false;
    } else {
      const event = {
        title: eventTitle.value,
        description: eventDescription.value,
        location: eventLocation.value,
        startDateTime: firstTimeStamp.value,
        endDateTime: secondTimeStamp.value,
        owner: store.activeUser.value.id,
      };

      EventsApi.addEvent(event).then(() => {
        handleCloseModal();
        location.reload();
      });
    }
  };
</script>

<template>
  <button
    class="bg-[#28353D] text-base-100 p-4 rounded-full bottom-2 right-2 fixed z-50 hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
    @click="handleOpenModal"
  >
    <img :src="Plus" alt="plus" class="w-10 h-10" />
  </button>
  <div
    v-if="showModal"
    class="fixed inset-0 w-screen min-h-screen z-40 flex justify-center items-center"
  >
    <div class="modal-box w-3/4 max-w-3xl rounded-2xl">
      <h1 class="text-3xl font-semibold my-6 mx-4">Add New Event</h1>
      <div class="min-w-full">
        <input
          v-model="eventTitle"
          type="text"
          placeholder="Title"
          class="input input-ghost placeholder-gray-400 text-xl w-full max-w-xs focus:outline-none focus:box-shadow-none focus:border-transparent mx-8"
        />
        <hr
          class="border-0 h-[3px] bg-current rounded-full text-gray-300 mx-12"
        />
        <div
          v-show="errorStatus"
          class="text-red-500 text-sm mx-8 my-2 font-bold text-center"
        >
          {{ errorMessages }}
          <span class="text-red-500 font-medium">is required</span>
        </div>
        <DatePicker
          @date="(date) => (selectedDate = date)"
          @first-time-stamp="(time) => (firstTimeStamp = time)"
          @second-time-stamp="(time) => (secondTimeStamp = time)"
          @is-next-day="(nextDay) => (isNextDay = nextDay)"
          @location="(location) => (eventLocation = location)"
          @description="(description) => (eventDescription = description)"
        />
      </div>
      <div class="modal-action flex justify-around min-w-full">
        <button
          class="btn w-1/3 rounded-xl border-black text-gray-500 hover:border-black"
          @click="handleCloseModal"
        >
          Close
        </button>
        <button
          class="btn btn-primary w-1/3 rounded-xl border-black text-white hover:border-black"
          @click="handleAddEvent"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
@/api/event.js