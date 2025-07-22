import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsloggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsloggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsloggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161636] text-white px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden bg-[#2a273f]">
        {/* Left Section (hidden on small screens) */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative p-6 flex-col justify-between"
          style={{
            backgroundImage: "url('/desert.png')",
          }}
        >
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm bg-white text-black rounded-full px-3 py-1 hover:bg-gray-200"
            >
              Back to website →
            </button>
          </div>

          <div className="text-left mt-auto">
            <h2 className="text-2xl font-semibold mb-2">
              Unlock Opportunities
            </h2>
            <p className="text-lg">Hire Smarter</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-[#2a273f] px-6 sm:px-10 py-10">
          <h2 className="text-3xl font-semibold mb-2">
            {state === "Sign up"
              ? "Create your account"
              : "Login to your account"}
          </h2>

          <p className="text-sm text-gray-400 mb-6 cursor-pointer">
            {state === "Sign up" ? (
              <>
                Already have an account?{" "}
                <span
                  className="underline hover:text-purple-400"
                  onClick={() => setState("Login")}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  className="underline hover:text-purple-400"
                  onClick={() => setState("Sign up")}
                >
                  Signup
                </span>
              </>
            )}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === "Sign up" && (
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  className="w-full border-[#1e1c30] bg-[#1e1c30] px-4 py-2 rounded-md text-white focus:outline-none"
                />
              </div>
            )}

            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full border-[#1e1c30] bg-[#1e1c30] px-4 py-2 mb-4 rounded-md text-white focus:outline-none"
            />
            <Input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full border-[#1e1c30] bg-[#1e1c30] px-4 py-2 mb-4 rounded-md text-white focus:outline-none"
            />

            <p
              className="text-sm text-purple-300 mb-4 hover:underline cursor-pointer"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </p>

            <Button className="w-full px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-200">
              {state}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
