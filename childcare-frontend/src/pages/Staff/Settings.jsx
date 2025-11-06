/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { authApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import TextInput from "../../components/TextInput";
import { motion } from "framer-motion";
import { 
  Lock, 
  Eye,
  EyeOff,
  Save,
  Key,
  Shield,
  User
} from "lucide-react";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    try {
      setLoading(true);
      await authApi.changePassword({
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully." });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
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
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account security</p>
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

      {/* Password Change Form */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <TextInput
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                icon={Lock}
                iconPosition="left"
                showPasswordToggle={true}
                onPasswordToggle={() => setShowOldPassword(!showOldPassword)}
                rightIcon={showOldPassword ? EyeOff : Eye}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <TextInput
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                icon={Lock}
                iconPosition="left"
                showPasswordToggle={true}
                onPasswordToggle={() => setShowNewPassword(!showNewPassword)}
                rightIcon={showNewPassword ? EyeOff : Eye}
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
                onChange={handleChange}
                placeholder="Confirm new password"
                icon={Lock}
                iconPosition="left"
                showPasswordToggle={true}
                onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* User Info Card */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Name</span>
            <span className="text-sm text-gray-900">{user?.name || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Email</span>
            <span className="text-sm text-gray-900">{user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-gray-600">Role</span>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              {user?.role || "staff"}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
