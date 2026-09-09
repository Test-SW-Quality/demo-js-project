<script setup>
  import { onMounted, ref, watch } from 'vue';
  import {
    daysInMonth,
    getMonthName,
    handleDecreaseMonth,
    handleIncreaseMonth,
  } from '../../utils/dateUtils';

  import {
    createTimeStamp,
    generateTimeStamps,
    secondTimeStampHandler,
    timeDifferences,
  } from '../../utils/timeUtils';

  import NextArrow from '../icons/nextArrow.svg';
  import PrevArrow from '../icons/prevArrow.svg';
  import DownArrow from '../icons/downArrow.svg';
  import Clock from '../icons/clock.svg';
  import Pin from '../icons/pin.svg';
  import DescriptionIcon from '../icons/desc.svg';

  const emit = defineEmits([
    'date',
    'firstTimeStamp',
    'secondTimeStamp',
    'isNextDay',
    'location',
    'description',
  ]);

  const selectedDate = ref('Select Date');
  const showCalendar = ref(false);
  const currentMonth = ref(new Date().getMonth());
  const currentYear = ref(new Date().getFullYear());

  const firstTimeStampDropdownVisible = ref(false);
  const secondTimeStampDropdownVisible = ref(false);
  const location = ref('');
  const description = ref('');

  const dev = false;
  const currentHour = dev ? 23 : new Date().getHours();
  const currentMinute = dev ? 45 : new Date().getMinutes();

  const firstTimeStamp = ref(createTimeStamp(currentHour, currentMinute)[0]);
  const secondTimeStamp = ref(createTimeStamp(currentHour, currentMinute)[1]);

  const firstTimeStamps = ref(generateTimeStamps(firstTimeStamp.value));
  const index = firstTimeStamps.value.findIndex((time) => time === '12:00 AM');
  const slicedTimeStamps = ref(firstTimeStamps.value.splice(0, index));
  const secondTimeStamps = ref(generateTimeStamps(secondTimeStamp.value));
  const timeDifferenceOptions = ref(
    timeDifferences(firstTimeStamp.value, secondTimeStamps.value)
  );

  secondTimeStamp.value = timeDifferences[0];

  const handleEvent = () => {
    secondTimeStamp.value = secondTimeStampHandler(
      firstTimeStamp.value,
      secondTimeStamp.value
    );
    secondTimeStamps.value = generateTimeStamps(secondTimeStamp.value);
    timeDifferenceOptions.value = timeDifferences(
      firstTimeStamp.value,
      secondTimeStamps.value
    );
    secondTimeStamp.value = timeDifferences[0];
    return secondTimeStamp.value;
  };

  const handleDecrease = () => {
    const { month, year } = handleDecreaseMonth(
      currentMonth.value,
      currentYear.value
    );
    currentMonth.value = month;
    currentYear.value = year;
  };

  const handleIncrease = () => {
    const { month, year } = handleIncreaseMonth(
      currentMonth.value,
      currentYear.value
    );
    currentMonth.value = month;
    currentYear.value = year;
  };

  const selectDateMethod = (day) => {
    selectedDate.value = `${day} ${getMonthName(currentMonth.value)}, ${
      currentYear.value
    }`;
    showCalendar.value = false;
  };

  const convertTo24Hour = (timeStamp) => {
    const [time, modifier] = timeStamp.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  watch(selectedDate, () => {
    emit('date', selectedDate.value);
  });

  watch(firstTimeStamp, () => {
    emit('firstTimeStamp', firstTimeStamp.value);
    if (!secondTimeStamp.value)
      emit('secondTimeStamp', secondTimeStamps.value[0]);
    if (firstTimeStamp.value === '11:45 PM') emit('isNextDay', true);
  });

  watch(secondTimeStamp, () => {
    if (secondTimeStamp.value) {
      const splitTimeStamp = secondTimeStamp.value.split(' ');
      if (splitTimeStamp.length > 2) {
        const [emit_2ndTime, emit_2ndAMPM] = splitTimeStamp;
        const emit_2ndTimeStamp = `${emit_2ndTime} ${emit_2ndAMPM}`;
        const firstTime24 = convertTo24Hour(firstTimeStamp.value);
        const secondTime24 = convertTo24Hour(emit_2ndTimeStamp);

        const baseDate = new Date(0, 0, 0);
        baseDate.setHours(0, 0, 0, 0);
        const firstDateTime = new Date(
          baseDate.setHours(...firstTime24.split(':').map(Number))
        );
        baseDate.setHours(0, 0, 0, 0);
        const secondDateTime = new Date(
          baseDate.setHours(...secondTime24.split(':').map(Number))
        );

        let isNextDay = false;
        if (secondDateTime < firstDateTime) {
          isNextDay = true;
        }

        emit('isNextDay', isNextDay);
        emit('secondTimeStamp', emit_2ndTimeStamp);
      }
    } else {
      emit('secondTimeStamp', secondTimeStamps.value[0]);
    }
  });

  watch(location, () => {
    emit('location', location.value);
  });

  watch(description, () => {
    emit('description', description.value);
  });

  onMounted(() => {
    emit('date', selectedDate.value);
    emit('firstTimeStamp', firstTimeStamp.value);
    emit(
      'secondTimeStamp',
      secondTimeStamp.value ? secondTimeStamp.value : secondTimeStamps.value[0]
    );
    emit('location', location.value);
    emit('description', description.value);
  });
</script>

<template>
  <div class="datepicker-container relative">
    <div>
      <div
        class="flex cursor-pointer items-center pt-2"
        @click="showCalendar = true"
      >
        <img :src="Clock" />
        <button
          class="my-1 pl-5 btn-ghost font-normal text-lg hover:outline-none hover:box-shadow-none hover:bg-transparent"
          :class="selectedDate === 'Select Date' ? 'text-gray-400' : ''"
        >
          {{ selectedDate }}
        </button>
        <img :src="DownArrow" alt="down" class="pl-3" />
      </div>
      <div
        v-if="showCalendar"
        class="z-[1] p-2 shadow bg-base-100 rounded-box w-64 fixed"
      >
        <div class="flex justify-between items-center p-1">
          <img
            :src="PrevArrow"
            alt="prev"
            class="w-6 h-6 cursor-pointer"
            @click="handleDecrease"
          />
          {{ getMonthName(currentMonth) }} {{ currentYear }}
          <img
            :src="NextArrow"
            alt="next"
            class="w-6 h-6 cursor-pointer"
            @click="handleIncrease"
          />
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="day in daysInMonth(currentYear, currentMonth)"
            :key="day"
            class="p-2 rounded cursor-pointer hover:bg-blue-100 text-center items-center"
            @click="selectDateMethod(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center text-center pl-9">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost after:focus:outline-none focus:box-shadow-none focus:border-transparent font-normal"
          @click="firstTimeStampDropdownVisible = true"
        >
          {{ firstTimeStamp }}
        </div>
        <ul
          v-show="firstTimeStampDropdownVisible"
          tabindex="0"
          class="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-28 max-h-60 overflow-y-auto"
        >
          <li
            v-for="time in slicedTimeStamps"
            :key="time"
            class="py-1 bg-gray-200 rounded-lg my-2 hover:bg-gray-300"
          >
            <a
              class="text-center cursor-pointer font-light"
              @click="
                firstTimeStamp = time;
                handleEvent();
                firstTimeStampDropdownVisible = false;
              "
            >
              {{ time }}
            </a>
          </li>
        </ul>
      </div>
      <span class="font-normal"> - </span>
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost after:focus:outline-none focus:box-shadow-none focus:border-transparent font-normal text-md"
          @click="secondTimeStampDropdownVisible = true"
        >
          {{ secondTimeStamp ? secondTimeStamp : timeDifferenceOptions[0] }}
        </div>
        <ul
          v-show="secondTimeStampDropdownVisible"
          tabindex="0"
          class="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box min-w-64 max-h-60 overflow-y-auto"
        >
          <li
            v-for="time in timeDifferenceOptions"
            :key="time"
            class="py-1 bg-gray-200 rounded-lg my-2 hover:bg-gray-300"
          >
            <a
              class="text-center cursor-pointer font-light"
              @click="
                secondTimeStamp = time;
                secondTimeStampDropdownVisible = false;
              "
            >
              {{ time }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex items-center pt-4">
      <img :src="Pin" class="pr-2" />
      <input
        v-model="location"
        type="text"
        class="input input-ghost placeholder-gray-400 text-lg focus:outline-none focus:box-shadow-none focus:border-transparent w-full bg-gray-200 rounded-sm m-0"
        placeholder="Add Location"
      />
    </div>
    <div class="flex items-start pt-4">
      <img :src="DescriptionIcon" class="pl-1 pr-2" />
      <textarea
        v-model="description"
        class="textarea placeholder-gray-400 text-lg focus:outline-none focus:box-shadow-none focus:border-transparent w-full pl-5 bg-gray-200 rounded-sm m-0 min-h-36"
        placeholder="Add Description"
      />
    </div>
  </div>
</template>

<style scoped></style>
