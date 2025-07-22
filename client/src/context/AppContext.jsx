/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import React, { createContext, useState } from "react";
import { toast } from "sonner";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      const userData = response.data.data;

      response.data.success
        ? setUserData(userData)
        : toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  console.log(userData);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsloggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
