import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-[#0d0333] to-[#030220] text-white mx-auto">
        <Navbar />
        {/* Body */}
        <Outlet />
      </main>
      
    </div>
  );
};

export default AppLayout;
