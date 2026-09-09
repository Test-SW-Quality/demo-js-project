<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    default() {
      return {
        id: '',
        title: '',
        description: '',
        location: '',
        startDateTime: '',
        endDateTime: '',
      };
    },
  },
  isInactive: Boolean,
});

const formattedTime = computed(() => {
  const formatDateTime = (dateTime) =>
    new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return `${formatDateTime(props.event.startDateTime)} - ${formatDateTime(props.event.endDateTime)}`;
});
</script>

<template>
  <div
    class="px-2 py-1 rounded-xl font-light text-sm border border-gray-600"
    :class="[isInactive ? 'bg-none' : 'bg-lime-100 ']"
  >
    <h4 class="font-semibold text-[12px] mb-[-4px]">{{ event.title }}</h4>
    <p class="text-[10px]">{{ formattedTime }}</p>
  </div>
</template>

<style scoped></style>
