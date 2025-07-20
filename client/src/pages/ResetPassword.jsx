import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { LockIcon, MailIcon } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((input) => input.value);
    const otpValue = otpArray.join("");
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4">
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md text-sm"
        >
          <h1 className="text-2xl font-semibold text-center mb-3 text-black dark:text-white">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Enter your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-black text-white">
            <MailIcon className="h-5 w-5" />
            <Input
              type="email"
              placeholder="Email id"
              className="bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400 outline-none border-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
            Submit
          </Button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md text-sm"
        >
          <h1 className="text-2xl font-semibold text-center mb-3 text-black dark:text-white">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your email id.
          </p>

          <div
            className="flex justify-between mb-8 gap-2"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 rounded-md"
                  ref={(e) => (inputRef.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <Button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
            Submit
          </Button>
        </form>
      )}

      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md text-sm"
        >
          <h1 className="text-2xl font-semibold text-center mb-3 text-black dark:text-white">
            New Password
          </h1>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-black text-white">
            <LockIcon className="h-5 w-5" />
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent text-white placeholder-gray-300 pr-24 dark:placeholder-gray-400 outline-none border-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 inset-y-0 my-auto text-muted-foreground focus:outline-none"
              >
                {showNewPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

// reser password page where user can enter the OTP to change their password
