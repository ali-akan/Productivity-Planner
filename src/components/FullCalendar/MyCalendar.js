import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin
import { addEventToDb, fetchEventsFromDb } from "../../firebase/DataBase"; // Import the function to add event to the database

function MyCalendar() {
  const [showForm, setShowForm] = useState(false); // State to toggle the event form visibility
  const [title, setTitle] = useState(""); // State for the event title
  const [start, setStart] = useState(""); // State for the event start date
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEventsFromDb((fetchedEvents) => {
      setEvents(fetchedEvents);
    });
  }, []);

  // Function to handle date click on the calendar
  const handleDateClick = (eventInfo) => {
    // Set the start date and show the form when a date is clicked
    setStart(eventInfo.dateStr);
    setShowForm(true);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title: title,
      start: start,
    };
    addEventToDb(newEvent); // Save the new event to the database
    // Clear the form fields and hide the form after submitting
    setTitle("");
    setStart("");
    setShowForm(false);
  };

  return (
    <div>
      {showForm && ( // Render the form if showForm state is true
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {/* Hide the start date input if it's already set */}
          {!start && (
            <label>
              Start Date:
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
          )}
          <button type="submit">Save Event</button>
        </form>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // Include the interaction plugin
        initialView="dayGridMonth"
        dateClick={handleDateClick} // Attach the handleDateClick function to the dateClick event
        events={events}
      />
    </div>
  );
}

export default MyCalendar;
