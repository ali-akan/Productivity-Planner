import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ref, push, set, get } from "firebase/database";
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
  const [selectedEvents, setSelectedEvents] = useState(null); // Added state for selected events

  const handleModalOpen = (start, events) => {
    setSelectedDate(start);
    setSelectedEvents(events); // Set selected events
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
      await set(newEventRef, {
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
        handleModalClose(); // Close the modal after successful submission
      },
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const handleDateClick = (eventInfo) => {
    const start = eventInfo.dateStr;
    const filteredEvents = events.filter(
      (ev) => ev.start === eventInfo.dateStr
    );
    if (start) {
      reset({ start });
      handleModalOpen(start, filteredEvents); // Pass filtered events
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

  return (
    <>
      <Button onClick={() => refetch()}>Refresh Events</Button>
      {isLoading && (
        <TypographyTheme variant="subtitle1">Loading...</TypographyTheme>
      )}
      {isError && (
        <Typography variant="subtitle1">Error fetching events</Typography>
      )}
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
      />

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <h2>{selectedEvents ? "Edit Events" : "Add Events"}</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Typography>Date: {selectedDate}</Typography>
            {selectedEvents &&
              selectedEvents.map((event, index) => (
                <div key={index}>
                  <Typography>Title: {event.title}</Typography>
                  <Typography>Description: {event.description}</Typography>
                </div>
              ))}
            <TextField
              label="Title"
              defaultValue={selectedEvents ? selectedEvents[0]?.title : ""}
              {...register("title", { required: true })}
            />
            {errors.title && <span>Title is required</span>}
            <TextField
              label="Description"
              defaultValue={
                selectedEvents ? selectedEvents[0]?.description : ""
              }
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
