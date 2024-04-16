import { ref, push, set, remove, onValue } from 'firebase/database';
import { firebaseDb } from './firebase';

// Function to add a new event to the database
export const addEventToDb = (event) => {
  const eventsRef = ref(firebaseDb, 'events');
  push(eventsRef, event);
};

// Function to update an existing event in the database
export const updateEventInDb = (eventId, newData) => {
  const eventRef = ref(firebaseDb, `events/${eventId}`);
  set(eventRef, newData);
};

// Function to delete an event from the database
export const deleteEventFromDb = (eventId) => {
  const eventRef = ref(firebaseDb, `events/${eventId}`);
  remove(eventRef);
};

export const fetchEventsFromDb = (callback) => {
    const eventsRef = ref(firebaseDb, 'events');
    onValue(eventsRef, (snapshot) => {
      const events = [];
      snapshot.forEach((childSnapshot) => {
        const eventData = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
        events.push(eventData);
      });
      // Check if callback is a function before calling it
      if (typeof callback === 'function') {
        callback(events);
      }
    });
  };
  