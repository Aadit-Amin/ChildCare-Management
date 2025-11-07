import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, Users, Baby, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Login to get token
      const data = await authApi.login(form);
      const token = data.access_token;

      if (!token) throw new Error("No token received from backend");

      // 2️⃣ Store token immediately
      localStorage.setItem("access_token", token);
      setToken(token);

      // 3️⃣ Fetch current user info
      const user = await authApi.getMe();

      // 4️⃣ Save user info
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // 5️⃣ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/staff");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // Apply dark theme by default on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || "dark";
    document.documentElement.className = savedTheme === "dark" ? "dark" : "";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated decorative circles */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-green-600 rounded-full opacity-10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding with Features */}
        <motion.div 
          className="hidden md:block text-center md:text-left space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo and Branding */}
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-8">
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-50 blur-md"></div>
              <span className="relative text-4xl">👶</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">KidsCare</h1>
              <p className="text-blue-300 text-sm font-medium">Manager</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Childcare Management
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Comprehensive system for managing your childcare center with ease and efficiency.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Track Children</p>
                  <p className="text-sm text-gray-400">Monitor all enrolled children</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Manage Activities</p>
                  <p className="text-sm text-gray-400">Organize daily activities</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
          <div>
                  <p className="font-semibold text-white">Health Records</p>
                  <p className="text-sm text-gray-400">Keep medical records safe</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl mb-4 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your childcare management account</p>
          </div>

          {/* Login Form */}
          <motion.div 
            className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Email Address
                </label>
                <TextInput
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={Mail}
                  iconPosition="left"
                  required
                  className="border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-700 text-white placeholder-gray-400 focus:bg-slate-600"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    icon={Lock}
                    iconPosition="left"
                    required
                    className="border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-700 text-white placeholder-gray-400 focus:bg-slate-600 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
          <button
            type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
          </button>
        </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
