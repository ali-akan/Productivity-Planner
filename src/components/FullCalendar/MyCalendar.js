import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ref, push, set, get, remove, update } from "firebase/database";
import { firebaseDb } from "../../firebase/firebase";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Box, Modal } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

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

  const handleDeleteConfirmation = () => {
    deleteEventMutation.mutate(deleteEventId);
    setDeleteEventId(null);
    setDeleteDialogOpen(false);
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
    setDeleteEventId(eventId);
    setDeleteDialogOpen(true);
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
      {isLoading && <Typography variant="subtitle1">Loading...</Typography>}
      {isError && (
        <Typography variant="subtitle1">Error fetching events</Typography>
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
        eventDrop={handleEventDrop}
        eventDragStart={handleEventDragStart}
        eventDragStop={handleEventDragStop}
      />

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Add Event"}
          </DialogTitle>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Typography>Date: {selectedDate}</Typography>
            {selectedEvent && (
              <>
                <Typography>Title: {selectedEvent.title}</Typography>
                <Typography>
                  Description: {selectedEvent.description}
                </Typography>
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
            <Box>
              <Button type="submit" variant="contained" color="secondary">
                Save
              </Button>
              {selectedEvent && (
                <Button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  variant="contained"
                  color="error"
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            bgcolor: "secondary.main",
            color: "background",
          }}
          variant="h4"
        >
          Confirm Delete
        </DialogTitle>
        <DialogTitle variant="paragraph">
          This change is permanent and cannot be undone.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MyCalendar;
