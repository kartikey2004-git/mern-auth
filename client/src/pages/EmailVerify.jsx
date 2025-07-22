import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const inputRef = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .slice(0, inputRef.current.length);
    paste.split("").forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
        if (index < inputRef.current.length - 1) {
          inputRef.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen  bg-[#161636] text-foreground">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl shadow-xl w-96 text-sm"
      >
        <h1 className="text-2xl text-white font-semibold text-center mb-2">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-gray-300">
          Enter the 6-digit code sent to your email id.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                required
                className="w-12 h-12 text-white bg-transparent border border-gray-400 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#9f59ff] rounded-md"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 text-white bg-[#9f59ff] hover:bg-[#a84bff] rounded-full transition duration-200">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;

// Verify user email where user will be enter the OTP to verify their email or account
