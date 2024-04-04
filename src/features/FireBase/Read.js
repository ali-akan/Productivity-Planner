import { firebaseApp } from "../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useState } from "react";
import { useAuth } from "../../context/authContext"; // Import useAuth hook for user authentication

const Read = () => {
  const { isLoggedIn, userInfo } = useAuth(); // Access authentication information from the auth context
  const [planArray, setPlanArray] = useState([]);

  const fetchData = async () => {
    if (!isLoggedIn) {
      alert("User is not authenticated. Please sign in.");
      return;
    }

    const firebaseDb = getDatabase(firebaseApp);
    const dbRef = ref(firebaseDb, `users/${userInfo.uid}/plans`); // Update database reference to user's plans node
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setPlanArray(Object.values(snapshot.val()));
    } else {
      alert("No plans data found for the user.");
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Display Data</button>
      <ul>
        {planArray.map((item, index) => (
          <li key={index}>
            {item.planName}: {item.planDefinition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Read;
