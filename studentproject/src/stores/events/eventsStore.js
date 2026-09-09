import { defineStore } from 'pinia';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
  }),
  actions: {
    setEvents(events) {
      this.events = events;
    },
    deleteEvent(eventId) {
      this.events = this.events.filter((event) => event.id !== eventId);
    },
  },
  getters: {
    allEvents() {
      return this.events;
    },
  },
});
