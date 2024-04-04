import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { ref, push, set } from "firebase/database";
import { firebaseDb } from "../../firebase/firebase";
import { useAuth } from "../../context/authContext"; // Import useAuth hook for user authentication
import Button from "@mui/material/Button";

const Write = () => {
  const queryClient = useQueryClient();
  const { userInfo, isLoggedIn } = useAuth(); // Access authentication information from the auth context

  const saveDataMutation = useMutation(
    async ({ planName, planDefinition }) => {
      if (!isLoggedIn) {
        throw new Error("User is not authenticated");
      }

      if (!planName || !planDefinition) {
        throw new Error("Please provide both Plan name and definition");
      }

      // Construct the database path for the current user
      const userPath = `users/${userInfo.uid}/plans`;

      // Push new data to the user's specific location in the database
      const newDocRef = push(ref(firebaseDb, userPath));
      await set(newDocRef, {
        planName,
        planDefinition,
      });
    },
    {
      onSuccess: () => {
        alert("Data saved successfully");
        queryClient.invalidateQueries("plans");
      },
      onError: (error) => {
        alert("Error: " + error.message);
      },
    }
  );

  const saveData = async () => {
    if (!isLoggedIn) {
      alert("User is not authenticated. Please sign in.");
      return;
    }

    saveDataMutation.mutate({
      planName: document.getElementById("planName").value,
      planDefinition: document.getElementById("planDefiniton").value,
    });
  };

  return (
    <div>
      <input type="text" id="planName" placeholder="Enter plan name" />
      <input
        type="text"
        id="planDefiniton"
        placeholder="Enter plan definition"
      />
      <Button onClick={saveData} variant="contained">
        Save Data
      </Button>
    </div>
  );
};

export default Write;
