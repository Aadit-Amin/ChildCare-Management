import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { attendanceApi, childrenApi } from "../../api/api";
import Loader from "../../components/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import TextInput from "../../components/TextInput";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Save, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Baby
} from "lucide-react";

export default function AttendanceForm() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [form, setForm] = useState({
    child_id: "",
    date: "",
    check_in: "",
    check_out: "",
    status: "Present",
  });

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      alert("You do not have permission to access this page.");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [childrenData, attendanceData] = await Promise.all([
          childrenApi.getAll(),
          id ? attendanceApi.getById(id) : Promise.resolve(null),
        ]);
        setChildren(childrenData);
        if (attendanceData) {
          setForm({
            child_id: attendanceData.child_id,
            date: attendanceData.date,
            check_in: attendanceData.check_in || "",
            check_out: attendanceData.check_out || "",
            status: attendanceData.status,
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  // ✅ Properly handle child_id as int and date/time as nullable
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "child_id" && value) {
      value = parseInt(value, 10);
    }

    if (["date", "check_in", "check_out"].includes(name) && value === "") {
      value = null;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (id) await attendanceApi.update(id, form);
      else await attendanceApi.create(form);

      alert(id ? "Attendance updated successfully." : "Attendance added successfully.");

      const redirectPath =
        user.role === "admin" ? "/admin/attendance" : "/staff/attendance";
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      alert("Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const getStatusIcon = (status) => {
    const baseClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10";
    switch (status) {
      case 'Present':
        return <CheckCircle className={`${baseClasses} text-green-600`} />;
      case 'Absent':
        return <XCircle className={`${baseClasses} text-red-600`} />;
      case 'Late':
        return <AlertCircle className={`${baseClasses} text-yellow-600`} />;
      default:
        return <AlertCircle className={`${baseClasses} text-gray-600`} />;
    }
  };

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
          onClick={() => navigate(user.role === "admin" ? "/admin/attendance" : "/staff/attendance")}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? "Edit Attendance" : "Add Attendance Record"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Update attendance information" : "Record daily attendance"}
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
                  required
                  className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                >
                  <option value="">Select a child</option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <TextInput
                  type="date"
                  name="date"
                  value={form.date || ""}
                  onChange={handleChange}
                  icon={Calendar}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check In Time
                </label>
                <TextInput
                  type="time"
                  name="check_in"
                  value={form.check_in || ""}
                  onChange={handleChange}
                  icon={Clock}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Out Time
                </label>
                <TextInput
                  type="time"
                  name="check_out"
                  value={form.check_out || ""}
                  onChange={handleChange}
                  icon={Clock}
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Status</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                {getStatusIcon(form.status)}
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full !pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                >
                  {["Present", "Absent", "Late", "Excused"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {form.status === 'Present' && "Child attended and was checked in"}
                {form.status === 'Absent' && "Child did not attend"}
                {form.status === 'Late' && "Child arrived after scheduled time"}
                {form.status === 'Excused' && "Child's absence was excused"}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(user.role === "admin" ? "/admin/attendance" : "/staff/attendance")}
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
                  {id ? "Update Attendance" : "Add Attendance"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
