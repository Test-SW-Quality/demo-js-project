<script setup>
import { computed } from 'vue';
import { useMedia } from '@/utils/useMedia.js';
import EventLabel from './EventLabel.vue';

defineEmits(['onClickEvent']);

const props = defineProps({
  currentDay: { type: Number, required: true },
  isInactive: { type: Boolean, required: true },
  events: { type: Array, default: () => [] },
});

const isLargeScreen = useMedia('(min-width: 1024px)');
const preparedEvents = computed(() => {
  return props.events.map((event) => ({
    ...event,
    title: isLargeScreen.value ? event.title : `${event.title.slice(0, 10)}...`,
  }));
});
</script>

<template>
  <div class="h-full w-full">
    <p class="text-right">
      {{ currentDay }}
    </p>
    <ul class="mt-2 flex flex-col gap-1 max-h-[80px] overflow-y-auto">
      <li
        v-for="event in preparedEvents"
        :key="event.id"
        class="hover:cursor-pointer"
        @click="$emit('onClickEvent', event)"
      >
        <EventLabel :event="event" :is-inactive="isInactive" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
