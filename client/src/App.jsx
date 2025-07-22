import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/Auth";
import AppLayout from "./layout/AppLayout";
import { Toaster } from "./components/ui/sonner";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/verify-email",
        element: <EmailVerify />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <Toaster />
    </>
  );
};

export default App;
