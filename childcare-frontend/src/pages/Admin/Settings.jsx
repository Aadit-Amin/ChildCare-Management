import React, { useEffect, useState, useContext } from "react";
import { authApi } from "../../api/api";
import Loader from "../../components/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import TextInput from "../../components/TextInput";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Palette,
  Bell,
  Key
} from "lucide-react";

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || "dark",
  });

  const [message, setMessage] = useState(null);

  // Fetch current user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getMe();
      setProfile({ name: data.name, email: data.email, role: data.role });
      setUser(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load profile." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Apply theme on page load
    const savedTheme = localStorage.getItem('theme') || "dark";
    document.documentElement.className = savedTheme === "dark" ? "dark" : "";
  }, []);

  useEffect(() => {
    document.documentElement.className = settings.theme === "dark" ? "dark" : "";
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await authApi.updateUser(user.id, {
        name: profile.name,
        email: profile.email,
      });
      setProfile({ name: updated.name, email: updated.email, role: updated.role });
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setSaving(false);
      return;
    }

    try {
      await authApi.updateUser(user.id, { password: passwords.newPassword });
      setMessage({ type: "success", text: "Password updated successfully." });
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update password." });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (e) => {
    setSettings({ theme: e.target.value });
  };

  if (loading) return <Loader />;

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </div>
      </motion.div>

      {/* Message Alert */}
      {message && (
        <motion.div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {message.text}
        </motion.div>
      )}

      {/* Profile Update Form */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form className="space-y-8" onSubmit={handleProfileSubmit}>
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <TextInput
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                icon={User}
                iconPosition="left"
                className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <TextInput
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                icon={Mail}
                iconPosition="left"
                className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none z-10" />
              <input
                type="text"
                value={profile.role}
                disabled
                className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                placeholder="Your role"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Role cannot be changed from this interface</p>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Password Update Form */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <form className="space-y-8" onSubmit={handlePasswordSubmit}>
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <TextInput
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                icon={Lock}
                iconPosition="left"
                showPasswordToggle={true}
                onPasswordToggle={() => setShowNewPassword(!showNewPassword)}
                rightIcon={showNewPassword ? EyeOff : Eye}
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <TextInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                icon={Lock}
                iconPosition="left"
                showPasswordToggle={true}
                onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Theme Settings */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none z-10" />
              <select
                value={settings.theme}
                onChange={handleThemeChange}
                className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-2">Choose your preferred color scheme</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
