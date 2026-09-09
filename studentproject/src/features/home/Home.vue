<script setup>
import Container from './components/Container.vue';
import TodayEvent from './components/TodayEvent.vue';
import Calendar from './components/Calendar.vue';
import AddModal from './AddModal.vue';
import Navbar from './components/Navbar.vue';
</script>

<template>
  <Navbar />
  <Container class="mb-6">
    <TodayEvent />
    <Calendar />
    <AddModal />
  </Container>
</template>

<style scoped></style>
