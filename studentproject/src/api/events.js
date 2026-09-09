import { EnvionmentUtils } from '@/utils/envUtils';

const BASE_URL = EnvionmentUtils.getBaseUrl() + 'events';

export class EventsApi {
  static async getEvents() {
    try {
      const activeUserId = localStorage.getItem('activeUserId');
      const response = await fetch(`${BASE_URL}?owner=${activeUserId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  static async getEventById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  static async updateEvent(updateEvented) {
    try {
      const response = await fetch(`${BASE_URL}/${updateEvented.id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(updateEvented),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  static async deleteEvent(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      return response.status;
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  static async addEvent(event) {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
