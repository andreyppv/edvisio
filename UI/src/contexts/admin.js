import React, { useState, useEffect } from "react";
// import { fetchUser as getUserData } from "../api/lms/authorization";
import { mockRequest } from "../utils/mockRequest";

const mockData = {
  data: {
    firstName: "Temeka",
    lastName: "Adams",
    id: "1234567",
  },
};

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ user: null, isAuthorized: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); //  useState({ message: '' });

  // FETCH USER AUTH
  async function fetchUser() {
    setLoading(true);
    const result = await mockRequest(mockData);
    if (result && result.data && !result.error) {
      setUser({ ...result, isAuthorized: true });
    } else if (result && result.error) {
      setError({ message: "server error" });
      setUser({ user: null, isAuthorized: false });
    } else {
      setUser({ user: null, isAuthorized: false });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const expose = {
    user,
    loading,
    error,
    setUser,
    setLoading,
    setError,
    fetchUser,
  };
  return <UserContext.Provider value={expose}>{children}</UserContext.Provider>;
};

export const useUserData = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error("component must be used within a UserProvider");
  }
  return context;
};
