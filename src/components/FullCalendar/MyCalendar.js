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
import TypographyTheme from "../../theme/TypographyTheme"

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

  const handleModalOpen = () => {
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
      },
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const handleDateClick = (eventInfo) => {
    const start = eventInfo.dateStr;
    if (start) {
      reset({ start });
      handleModalOpen();
    } else {
      alert("Please select a valid date");
    }
  };

  const handleFormSubmit = (data) => {
    addEventMutation.mutate({
      title: data.title,
      description: data.description,
      start: data.start,
    });
    handleModalClose();
  };

  return (
    <>
      <Button onClick={() => refetch()}>Refresh Events</Button>
      {isLoading && <TypographyTheme variant="subtitle1">Loading...</TypographyTheme>}
      {isError && (
        <TypographyTheme variant="subtitle1">Error fetching events</TypographyTheme>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
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
          <h2>Add Event</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <TextField
              label="Title"
              {...register("title", { required: true })}
            />
            {errors.title && <span>Title is required</span>}
            <TextField label="Description" {...register("description")} />
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
