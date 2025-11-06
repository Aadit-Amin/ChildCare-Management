// pages/Admin/UserForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../api/api";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import TextInput from "../../components/TextInput";

export default function UserForm() {
  const { id } = useParams(); // if editing, id will exist
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff", // default role
  });

  // Fetch user details when editing
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        // First check if user data was passed through navigation state
        const passedUserData = location.state?.userData;
        if (passedUserData) {
          setUser({
            name: passedUserData.name,
            email: passedUserData.email,
            password: "", // Don't pre-fill password for security
            role: passedUserData.role
          });
          return;
        }

        // Fallback to API call if no data passed
        try {
          setLoading(true);
          const userData = await authApi.getById(id);
          setUser({
            name: userData.name,
            email: userData.email,
            password: "", // Don't pre-fill password for security
            role: userData.role
          });
        } catch (error) {
          console.error("Failed to load user:", error);
          alert("Failed to load user data. The user may have been deleted or the endpoint may not exist.");
          navigate("/admin/users");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [id, location.state, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // Update existing user
        await authApi.updateUser(id, {
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.password ? { password: user.password } : {}), // optional password update
        });
        alert("User updated successfully.");
      } else {
        // Create new user
        await authApi.register({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        });
        alert("User created successfully.");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      alert("Failed to save user.");
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
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? "Edit User" : "Add New User"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Update user information" : "Create a new system user"}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <TextInput
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  icon={User}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <TextInput
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  icon={Mail}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          {!id && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    icon={Lock}
                    iconPosition="left"
                    className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Role Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Role & Permissions</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none z-10" />
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                  required
                >
                  <option value="admin">Administrator</option>
                  <option value="staff">Staff Member</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {user.role === 'admin' && "Full system access and management capabilities"}
                {user.role === 'staff' && "Access to children, activities, and daily operations"}
                {user.role === 'parent' && "Limited access to their child's information"}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
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
                  <span>{id ? "Update User" : "Create User"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
