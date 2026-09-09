<script setup>

defineProps({
  events: {
    type: Array,
    required: true,
  },
});

</script>

<template>
  <div>
    <slot v-for="(item, index) in events" :key="index" name="list" :item="item"></slot>
  </div>
</template>

<style scoped></style>
