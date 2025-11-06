import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, Users } from "lucide-react";
import TextInput from "../../components/TextInput";

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Apply dark theme by default on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || "dark";
    document.documentElement.className = savedTheme === "dark" ? "dark" : "";
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authApi.register(form);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-80 h-80 bg-pink-600 rounded-full opacity-10 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-50 blur-sm"></div>
              <span className="relative text-3xl">👶</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">KidsCare</h1>
              <p className="text-blue-300 text-xs font-medium">Manager</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300">Join our childcare management platform</p>
        </div>

        {/* Register Form */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Full Name
              </label>
              <TextInput
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={User}
                required
                className="border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:bg-slate-600"
              />
            </div>

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
                required
                className="border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:bg-slate-600"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <TextInput
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={Lock}
                showPasswordToggle
                onPasswordToggle={() => setShowPassword(!showPassword)}
                rightIcon={showPassword ? EyeOff : Eye}
                required
                className="border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:bg-slate-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
