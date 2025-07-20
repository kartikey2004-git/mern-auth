import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoIosContact } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsloggedIn, getUserData } = useContext(AppContext);

  const [form, setForm] = useState({
    login: { email: "", password: "" },
    register: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleChange = (tab, field, value) => {
    setForm((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (tab) => {
    const { name, email, password } = form[tab];

    if (!email || !password || (tab === "register" && !name)) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        tab === "register" ? "/api/auth/register" : "/api/auth/login";

      const payload =
        tab === "register" ? { name, email, password } : { email, password };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload, {
        withCredentials: true,
      });

      const data = response?.data;

      if (data?.success) {
        toast.success(data.message || "Success!");
        setIsloggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(msg);
      console.error("Auth Error:", msg, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center  items-center min-h-screen px-4 text-white ">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl text-white/60 font-semibold tracking-tight">
            Find your next opportunity
          </h1>
          <p className="text-sm "></p>
        </div>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-md">
            <TabsTrigger
              value="signup"
              className=" text-white font-normal transition-colors duration-300 data-[state=active]:bg-gradient-to-br from-[#080223] to-[#020219] data-[state=active]:text-white hover:bg-white/10"
            >
              Signup
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className=" text-white font-normal transition-colors duration-300 data-[state=active]:bg-gradient-to-br from-[#080223] to-[#020219] data-[state=active]:text-white hover:bg-white/10"
            >
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="animate-fade-in bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white mt-6 bg-gradient-to-br from-[#080223] to-[#020219]">
              <CardHeader>
                <CardTitle className="text-xl font-light">
                  Login to Your Account
                </CardTitle>
                <CardDescription className="text-sm text-white/60">
                  Enter your credentials to continue.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5">
                {/* Email */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="login-email"
                    className="text-white/60 font-normal"
                  >
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.login.email}
                    onChange={(e) =>
                      handleChange("login", "email", e.target.value)
                    }
                    required
                    className="bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="login-password"
                    className="flex text-white/60 font-normal items-center gap-2"
                  >
                    <RiLockPasswordLine className="w-5 h-5" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.login.password}
                      onChange={(e) =>
                        handleChange("login", "password", e.target.value)
                      }
                      required
                      className="pr-10 bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 inset-y-0 my-auto text-muted-foreground focus:outline-none"
                    >
                      {showLoginPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right text-sm">
                  <p
                    onClick={() => navigate("/reset-password")}
                    className="text-white hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-br from-[#080223] to-[#020219] border text-white font-normal border-white/20 transition"
                  onClick={() => handleSubmit("login")}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* === SIGNUP FORM === */}
          <TabsContent value="signup">
            <Card className="animate-fade-in bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white bg-gradient-to-br from-[#080223] to-[#020219] mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-light">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-sm text-white/60">
                  Sign up to unlock all features.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5">
                {/* Name */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="register-name"
                    className="flex items-center gap-2 text-white/60 font-normal"
                  >
                    <IoIosContact className="w-5 h-5" />
                    Full Name
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="e.g. Kartikey Bhatnagar"
                    value={form.register.name}
                    onChange={(e) =>
                      handleChange("register", "name", e.target.value)
                    }
                    required
                    className="bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="register-email"
                    className="flex text-white/60 font-normal items-center gap-2"
                  >
                    <MdEmail className="w-5 h-5" />
                    Email Address
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.register.email}
                    onChange={(e) =>
                      handleChange("register", "email", e.target.value)
                    }
                    required
                    className="bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="register-password"
                    className="flex items-center  text-white/60 font-normal gap-2"
                  >
                    <RiLockPasswordLine className="w-5 h-5" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={form.register.password}
                      onChange={(e) =>
                        handleChange("register", "password", e.target.value)
                      }
                      required
                      className="pr-10 bg-white/10 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      className="absolute right-3 inset-y-0 my-auto text-muted-foreground focus:outline-none"
                    >
                      {showSignupPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-br from-[#080223] to-[#020219] border border-white/20 text-white font-semibold transition"
                  onClick={() => handleSubmit("register")}
                  disabled={
                    loading ||
                    !form.register.name.trim() ||
                    !form.register.email.trim() ||
                    !form.register.password.trim()
                  }
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
