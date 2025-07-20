/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleError = (error) => {
    toast.error(error?.response?.data?.message || error.message);
  };

  //  Get current auth state (checks JWT token cookie validity)

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsloggedIn(true);
        getUserData();
      } else {
        setIsloggedIn(false);
      }
    } catch (error) {
      handleError(error);
      setIsloggedIn(false);
    }
  }, [backendUrl]);

  //  Get user data from backend if logged in
  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  }, [backendUrl]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

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

// in the context folder , a context file that stores all the states and function

// in this value object we can pass any state variables and functions , so that we that we can access them throughout our app
