import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { staffApi, authApi } from "../../api/api";
import Loader from "../../components/Loader";
import TextInput from "../../components/TextInput";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Save, 
  ArrowLeft,
  Users
} from "lucide-react";

export default function StaffForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    contact: "",
    position: "",
    assigned_room: "",
    hire_date: "",
  });

  // ✅ Fetch single staff record if editing
  const fetchStaff = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await staffApi.getById(id);
      setForm({
        user_id: data.user_id,
        contact: data.contact || "",
        position: data.position || "",
        assigned_room: data.assigned_room || "",
        hire_date: data.hire_date || "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch staff data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ Fetch users who can become staff
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const data = await authApi.getAvailableStaffUsers();
      setAvailableUsers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch available users.");
    }
  }, []);

  useEffect(() => {
    fetchAvailableUsers();
    fetchStaff();
  }, [fetchAvailableUsers, fetchStaff]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await staffApi.update(id, form);
        alert("Staff updated successfully.");
      } else {
        await staffApi.create(form);
        alert("Staff added successfully.");
      }
      navigate("/admin/staff");
    } catch (error) {
      console.error(error);
      alert("Failed to save staff.");
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
          onClick={() => navigate("/admin/staff")}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? "Edit Staff Member" : "Add Staff Member"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Update staff information" : "Add a new staff member to the team"}
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Selection Section (only when adding new staff) */}
          {!id && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">User Selection</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                  <select
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    className="w-full pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white pl-12"
                    required
                  >
                    <option value="">Select a user</option>
                    {availableUsers.length === 0 ? (
                      <option disabled>No available users</option>
                    ) : (
                      availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Select a user account to convert to staff member
                </p>
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <TextInput
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                icon={Phone}
                iconPosition="left"
                className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter contact number"
                required
              />
            </div>
          </div>

          {/* Job Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Job Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <TextInput
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  icon={Briefcase}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Teacher, Assistant, Manager"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Room
                </label>
                <TextInput
                  type="text"
                  name="assigned_room"
                  value={form.assigned_room}
                  onChange={handleChange}
                  icon={MapPin}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Room A, Playground, Office"
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Employment Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire Date
              </label>
              <TextInput
                type="date"
                name="hire_date"
                value={form.hire_date}
                onChange={handleChange}
                icon={Calendar}
                iconPosition="left"
                className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/staff")}
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {id ? "Update Staff" : "Add Staff"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
