<script setup>
defineProps({
  event: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white text-sm px-10 py-1 my-2 rounded-3xl">
    <slot name="content">
      <h4>{{ event.title }}</h4>
      {{
        new Date(event.startDateTime).toLocaleTimeString('en-UK', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Asia/Bangkok',
          hour12: true,
        })
      }}
      -
      {{
        new Date(event.endDateTime).toLocaleTimeString('en-UK', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Asia/Bangkok',
          hour12: true,
        })
      }}
    </slot>
  </div>
</template>

<style scoped></style>
