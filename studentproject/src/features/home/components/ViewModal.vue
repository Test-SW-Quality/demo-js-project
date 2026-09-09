<script setup>
import { ref } from 'vue';
import ClockIcon from '../../icons/clock.svg';
import CrossIcon from '../../icons/cross.svg';
import DeleteIcon from '../../icons/delete.svg';
import DescriptionIcon from '../../icons/desc.svg';
import EditIcon from '../../icons/edit.svg';
import LocationIcon from '../../icons/pin.svg';
import RemoveModal from './RemoveModal.vue';
import { EventsApi } from '@/api/events.js';
import { useEventsStore } from '@/stores/events';

const emit = defineEmits(['close']);

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
});

//RemoveModal
const showRemoveModal = ref(false);
const handleOpenRemoveModal = () => {
  showRemoveModal.value = true;
};
const handleCloseRemoveModal = () => {
  showRemoveModal.value = false;
};

//RemoveEvent
const store = useEventsStore();

const handleRemoveEvent = async () => {
  await EventsApi.deleteEvent(props.event.id);
  store.deleteEvent(props.event.id);
  handleCloseRemoveModal();
  emit('close');
};

// const getMonthfromAPI = getMonthNameByIndex(props.event.startDateTime.split('T')[0].split('-')[1])

// const showView = ref(false);
// const closeView = ref(showView = 'false');
</script>

<template>
  <!-- <section v-show="showView"> -->
  <div>
    <div class="fixed inset-0 bg-black bg-opacity-80">
      <div class="bg-white p-10 w-[30vw] h-full">
        <div class="flex gap-4 justify-end">
          <router-link :to="{ name: 'EditEvent', params: { id: event.id } }">
            <img :src="EditIcon" alt="EditIcon" width="21" class="cursor-pointer" />
          </router-link>
          <img :src="DeleteIcon" alt="DeleteIcon" width="15" class="cursor-pointer" @click="handleOpenRemoveModal" />
          <img :src="CrossIcon" alt="CrossIcon" width="19" class="cursor-pointer" @click="$emit('close')" />
        </div>
        <div class="pt-12">
          <h1 class="text-2xl font-bold">{{ event?.title }}</h1>
          <hr class="border-[#999999] border-[1.2px] mt-1" />
          <div class="mt-7">
            <div class="flex gap-4 items-start">
              <img :src="ClockIcon" alt="ClockIcon" width="21" />
              <div>
                <h2 class="font-semibold">
                  {{
                    new Date(event.startDateTime).toLocaleDateString('en-UK', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Bangkok',
                    })
                  }}
                  -
                  {{
                    new Date(event.endDateTime).toLocaleDateString('en-UK', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Bangkok',
                    })
                  }}
                </h2>
                <p class="text-sm mt-1">
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
                </p>
              </div>
            </div>
          </div>
          <div class="flex gap-4 mt-7 items-start">
            <img :src="LocationIcon" alt="LocationIcon" width="21" />
            <h2 class="font-semibold">{{ event?.location }}</h2>
          </div>
          <div class="flex gap-4 mt-7 items-start">
            <img :src="DescriptionIcon" alt="DescriptionIcon" width="21" />
            <p>
              {{ event?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RemoveModal
    :show-remove-modal="showRemoveModal"
    @on-click-cancel="handleCloseRemoveModal"
    @on-click-remove="handleRemoveEvent"
  />
  <!-- </section> -->
</template>

<style scoped></style>
@/api/event