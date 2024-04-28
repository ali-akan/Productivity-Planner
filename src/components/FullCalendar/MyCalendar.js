import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ref, push, set, get, remove, update } from "firebase/database";
import { firebaseDb } from "../../firebase/firebase";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import { Modal, Button, TextField, Typography, Box } from "@mui/material";
import TypographyTheme from "../../theme/TypographyTheme";

function MyCalendar() {
  const queryClient = useQueryClient();
  const { userInfo, isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const draggableEl = document.getElementById("draggable-element");
    const draggable = new Draggable(draggableEl, {
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText,
        };
      },
    });

    return () => {
      draggable.destroy();
    };
  }, []);

  const handleModalOpen = (start, event) => {
    setSelectedDate(start);
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const fetchEvents = async () => {
    if (!isLoggedIn) {
      throw new Error("User is not authenticated");
    }

    const userPath = `users/${userInfo.uid}/plans`;
    const eventsRef = ref(firebaseDb, userPath);
    const snapshot = await get(eventsRef);
    const eventData = snapshot.val();

    return eventData ? Object.values(eventData) : [];
  };

  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery("events", fetchEvents, {
    enabled: isLoggedIn,
  });

  const addEventMutation = useMutation(
    async ({ title, description, start }) => {
      const userPath = `users/${userInfo.uid}/plans`;
      const newEventRef = push(ref(firebaseDb, userPath));
      const eventId = newEventRef.key;
      await set(newEventRef, {
        id: eventId,
        title,
        description,
        start,
      });
    },
    {
      onSuccess: () => {
        alert("Event added successfully");
        queryClient.invalidateQueries("events");
        reset();
        handleModalClose();
      },
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const deleteEventMutation = useMutation(
    async (eventId) => {
      const userPath = `users/${userInfo.uid}/plans/${eventId}`;
      await remove(ref(firebaseDb, userPath));
    },
    {
      onSuccess: () => {
        alert("Event deleted successfully");
        queryClient.invalidateQueries("events");
        handleModalClose();
      },
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const updateEventMutation = useMutation(
    async ({ eventId, start }) => {
      const userPath = `users/${userInfo.uid}/plans/${eventId}`;
      await update(ref(firebaseDb, userPath), { start });
    },
    {
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const handleDateClick = (eventInfo) => {
    const start = eventInfo.dateStr;
    if (start) {
      reset({ start });
      handleModalOpen(start, null);
    } else {
      alert("Please select a valid date");
    }
  };

  const handleFormSubmit = (data) => {
    addEventMutation.mutate({
      title: data.title,
      description: data.description,
      start: selectedDate,
    });
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const handleEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;
    const eventId = event.id;
    const newStart = event.startStr;

    updateEventMutation.mutate(
      { eventId, start: newStart },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("events");
          refetch();
        },
      }
    );
  };

  const handleEventDragStart = (eventDragInfo) => {
    const eventEl = eventDragInfo.el;
    eventEl.classList.add("fc-dragging");
  };

  const handleEventDragStop = (eventDragInfo) => {
    const eventEl = eventDragInfo.el;
    eventEl.classList.remove("fc-dragging");
  };

  return (
    <>
      <Button onClick={() => refetch()}>Refresh Events</Button>
      {isLoading && (
        <TypographyTheme variant="subtitle1">Loading...</TypographyTheme>
      )}
      {isError && (
        <TypographyTheme variant="subtitle1">
          Error fetching events
        </TypographyTheme>
      )}
      <div id="draggable-element">Drag me to create an event</div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={
          events
            ? events.map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
              }))
            : []
        }
        dayMaxEventRows={true}
        displayEventTime={false}
        eventDisplay="block"
        eventBackgroundColor={"#ffffd2"}
        eventTextColor={"#2C3E50"}
        editable={true}
        eventClick={(info) => {
          handleModalOpen(info.event.startStr, info.event);
        }}
        eventDrop={handleEventDrop} // Add event drop handler
        eventDragStart={handleEventDragStart} // Add event drag start handler
        eventDragStop={handleEventDragStop} // Add event drag stop handler
      />

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            bgcolor: "secondary.main",
          }}
        >
          <h2>{selectedEvent ? "Edit Event" : "Add Event"}</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Typography
              sx={{
                color: "text.secondary",
                m: 2,
              }}
            >
              Date: {selectedDate}
            </Typography>
            {selectedEvent && (
              <>
                <TypographyTheme>Title: {selectedEvent.title}</TypographyTheme>
                <TypographyTheme>
                  Description: {selectedEvent.description}
                </TypographyTheme>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  Delete
                </Button>
              </>
            )}
            <TextField
              label="Title"
              defaultValue={selectedEvent ? selectedEvent.title : ""}
              {...register("title", { required: true })}
            />
            {errors.title && <span>Title is required</span>}
            <TextField
              label="Description"
              defaultValue={selectedEvent ? selectedEvent.description : ""}
              {...register("description")}
            />
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default MyCalendar;
