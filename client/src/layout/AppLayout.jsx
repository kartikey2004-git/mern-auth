import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AppLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // delay helps when navigating between pages
      }
    }
  }, [location]);
  
  return (
    <div>
      <main className="min-h-screen bg-[#161636] text-white mx-auto">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
