import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";
import axios from "axios";
import VerifyDropdown from "./VerifyDropDown";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { userData, backendUrl, setUserData, setIsloggedIn } =
    useContext(AppContext);

  console.log("User:", userData);

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
    { label: "Features", path: "/#features" },
    { label: "About", path: "/#about" },
    { label: "FAQs", path: "/#faqs" },
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-6 lg:px-16 py-4 md:py-6 backdrop-blur-md bg-[rgba(15,15,30,0.7)] border border-[#2a2a3f] shadow-[0_1px_10px_rgba(0,0,0,0.1)] z-50">
      <h1
        className="text-2xl md:text-3xl text-white cursor-pointer"
        onClick={() => navigate("/")}
      >
        JobConnect
      </h1>

      <div className="md:hidden ml-52">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <ul className="hidden md:flex gap-6 text-sm text-white/70">
        {navItems.map((item) => (
          <li key={item.label} className="hover:text-white cursor-pointer">
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Auth / Avatar */}
      <div className="z-10 flex items-center gap-4 relative">
        {userData ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-800 text-white font-semibold cursor-pointer hover:scale-105 transition ml-1"
              >
                {userData.name[0].toUpperCase()}
              </div>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <VerifyDropdown backendUrl={backendUrl} userData={userData} />
                </div>
              )}
            </div>

            <Button
              onClick={logout}
              className="px-4 py-2 border border-white/30  hover:text-white hover:border-white text-sm bg-purple-700 hover:bg-purple-800 text-white  hidden md:block"
              variant="ghost"
            >
              Logout
            </Button>
          </>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-sm shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-200 hidden md:block"
            variant="ghost"
          >
            Login / Register
          </button>
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
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}

          {!userData ? (
            <button
              onClick={() => {
                navigate("/auth");
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
              className="mt-2 px-4 py-2 border border-white/30 rounded-md  bg-purple-700 hover:bg-purple-800 text-white text-sm"
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
