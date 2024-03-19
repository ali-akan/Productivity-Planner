import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase/firebase";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null); // Changed from currentUser to userToken
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      const token = await user.getIdToken();
      setUserToken(token);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      setUserToken(null);
      setIsLoggedIn(false);
      navigate("/login");
    }
    setLoading(false);
  }

  const value = {
    userToken,
    isLoggedIn,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
