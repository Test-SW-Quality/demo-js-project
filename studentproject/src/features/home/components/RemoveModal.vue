<script setup>
defineEmits(['onClickCancel', 'onClickRemove']);
defineProps({
  showRemoveModal: {
    type: Boolean,
  },
});
</script>

<template>
  <section v-if="showRemoveModal">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transform-[-50%]">
      <div class="bg-white p-8 rounded-lg w-[50vw]">
        <h1 class="flex text-2xl font-bold mb-4 justify-center">Are you sure?</h1>
        <div class="flex gap-6 w-full justify-center">
          <button class="btn btn-wide bg-red-btn itim rounded-2xl" @click="$emit('onClickCancel')">Cancel</button>
          <button class="btn btn-wide bg-green-btn itim rounded-2xl" @click="$emit('onClickRemove')">Remove</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
