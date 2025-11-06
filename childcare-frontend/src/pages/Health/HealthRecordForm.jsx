import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { healthRecordsApi, childrenApi, staffApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { motion } from "framer-motion";
import { 
  Heart, 
  Calendar, 
  User, 
  Save, 
  ArrowLeft,
  Stethoscope,
  FileText,
  Baby,
  Trash2
} from "lucide-react";

export default function HealthRecordForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [form, setForm] = useState({
    child_id: "",
    description: "",
    doctor_name: "",
    record_date: "",
  });

  // ✅ Fetch single record (for edit)
  const fetchRecord = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await healthRecordsApi.getById(id);
      setForm({
        child_id: data.child_id || "",
        description: data.description || "",
        doctor_name: data.doctor_name || "",
        record_date: data.record_date || "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch health record details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ Fetch children list
  const fetchChildren = useCallback(async () => {
    try {
      const data = await childrenApi.getAll();
      setChildren(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load children list.");
    }
  }, []);

  // ✅ Fetch staff list (for doctor_name dropdown)
  const fetchStaff = useCallback(async () => {
    try {
      const data = await staffApi.getAll();
      setStaffList(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load staff list.");
    }
  }, []);

  useEffect(() => {
    fetchChildren();
    fetchStaff();
    fetchRecord();
  }, [fetchChildren, fetchStaff, fetchRecord]);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // If staff creates a record, ensure their name is used
      const finalForm = {
        ...form,
        doctor_name:
          user?.role === "staff" ? user.name : form.doctor_name,
      };

      if (id) {
        await healthRecordsApi.update(id, finalForm);
        alert("Health record updated successfully.");
      } else {
        await healthRecordsApi.create(finalForm);
        alert("Health record added successfully.");
      }

      const basePath = user?.role === "admin" ? "/admin/health" : "/staff/health";
      navigate(basePath);
    } catch (error) {
      console.error(error);
      alert("Failed to save health record.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this health record?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await healthRecordsApi.remove(id);
      alert("Health record deleted successfully.");
      const basePath = user?.role === "admin" ? "/admin/health" : "/staff/health";
      navigate(basePath);
    } catch (error) {
      console.error(error);
      alert("Failed to delete health record.");
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
          onClick={() => navigate(user?.role === "admin" ? "/admin/health" : "/staff/health")}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? "Edit Health Record" : "Add Health Record"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Update medical information" : "Record medical information"}
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
          {/* Child Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Baby className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Child Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Child
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none z-10" />
                <select
                  name="child_id"
                  value={form.child_id}
                  onChange={handleChange}
                  className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                  required
                >
                  <option value="">Select a child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <TextArea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the medical condition, treatment, or observation..."
                icon={FileText}
                required
              />
            </div>
          </div>

          {/* Doctor and Date Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Medical Professional & Date</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor (Staff)
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none z-10" />
                  {user?.role === "admin" ? (
                    <select
                      name="doctor_name"
                      value={form.doctor_name}
                      onChange={handleChange}
                      className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                      required
                    >
                      <option value="">Select a doctor</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.user?.name}>
                          {staff.user?.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="doctor_name"
                      value={user?.name || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      readOnly
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Date
                </label>
                <TextInput
                  type="date"
                  name="record_date"
                  value={form.record_date}
                  onChange={handleChange}
                  icon={Calendar}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(user?.role === "admin" ? "/admin/health" : "/staff/health")}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              {id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>

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
                  {id ? "Update Record" : "Add Record"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
