import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import VerifyDropdown from "./VerifyDropDown";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsloggedIn } =
    useContext(AppContext);

  const handleError = (error) => {
    toast.error(error?.response?.data?.message || error.message);
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsloggedIn(false);
        setUserData(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "FAQs", path: "/faqs" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 lg:px-16 py-4 md:py-6 relative z-50">
      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl text-white cursor-pointer"
        onClick={() => navigate("/")}
      >
        JobConnect
      </h1>

      {/* Mobile Menu Button */}
      <div className="md:hidden ml-52">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-6 text-sm text-white/70">
        {navItems.map((item) => (
          <li
            key={item.label}
            className="hover:text-white cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      {/* Auth / Avatar */}
      <div className="z-10 flex items-center gap-4">
        {userData ? (
          <>
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white font-semibold cursor-pointer hover:scale-105 transition"
              title={userData.name}
            >
              {userData.name[0].toUpperCase()}
            </div>

            <div className="absolute right-0 top-full mt-2 hidden group-hover:block">
              <VerifyDropdown backendUrl={backendUrl} userData={userData} />
            </div>

            <Button
              onClick={logout}
              className="px-4 py-2 border border-white/30 text-white/80 hover:text-white hover:border-white text-sm hidden md:block"
              variant="ghost"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-white/30 text-white/80 hover:bg-[#1f1a50] hover:text-purple-300 text-sm hidden md:block"
            variant="ghost"
          >
            Login / Register
          </Button>
        )}
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-[#0d0333] border-t border-white/10 py-4 px-6 flex flex-col gap-4 md:hidden">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="text-white/80 hover:text-white cursor-pointer"
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}

          {!userData ? (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="mt-2 px-4 py-2 border border-white/30 rounded-md text-sm text-white/80 hover:border-white hover:text-white"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="mt-2 px-4 py-2 border border-white/30 rounded-md text-sm text-white/80 hover:border-white hover:text-white"
            >
              Logout
            </button>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
