import React from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyDropdown = ({ backendUrl, userData }) => {
  const navigate = useNavigate();

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userData?.accountVerified === true) return null;

  return (
    <div className="absolute top-[110%] right-0 bg-[#1e1e2f] text-white text-sm rounded-lg shadow-lg px-4 py-3 w-60 z-50">
      <p className="mb-2 text-white/80">Your account is not verified yet.</p>
      <button
        onClick={sendVerificationOtp}
        className="w-full text-sm bg-purple-600 hover:bg-purple-700  text-white py-1.5 px-3 rounded-md transition"
      >
        Send Verification OTP
      </button>
    </div>
  );
};

export default VerifyDropdown;
