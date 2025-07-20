import { Button } from "@/components/ui/button";
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

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
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
    <div className="flex justify-center items-center min-h-screen  bg-background text-foreground">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-2xl text-black font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-gray-600">
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
                className="w-12 h-12 dark:text-black  bg-transparent border border-gray-300 dark:border-gray-600 text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <Button className="w-full py-3 text-white bg-black rounded-full">
          Verify Email
        </Button>
      </form>
    </div>
  );
};

export default EmailVerify;

// Verify user email where user will be enter the OTP to verify their email or account
