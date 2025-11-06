import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { activitiesApi, staffApi } from "../../api/api";
import Loader from "../../components/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { 
  Activity, 
  Calendar, 
  Clock, 
  User, 
  Save, 
  ArrowLeft,
  FileText
} from "lucide-react";

export default function ActivityForm() {
  const { user } = useContext(AuthContext); // ✅ get logged-in user
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
    assigned_staff_id: "",
  });

  const fetchActivity = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await activitiesApi.getById(id);
      setForm({
        title: data.title,
        description: data.description,
        scheduled_date: data.scheduled_date,
        start_time: data.start_time,
        end_time: data.end_time,
        assigned_staff_id: data.assigned_staff_id || "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch activity.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await staffApi.getAll();
      setStaffList(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch staff.");
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await activitiesApi.update(id, form);
        alert("Activity updated successfully.");
      } else {
        await activitiesApi.create(form);
        alert("Activity added successfully.");
      }

      // ✅ Dynamic redirect based on role
      const redirectPath =
        user?.role === "staff" ? "/staff/activities" : "/admin/activities";
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      alert("Failed to save activity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const basePath = user?.role === "staff" ? "/staff/activities" : "/admin/activities";

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(basePath)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? "Edit Activity" : "Add New Activity"}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? "Update activity details" : "Schedule a new activity"}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Activity Management</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Activity Details</h2>
          </div>
          
          <div className="space-y-4">
        <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Activity Title *
              </label>
              <TextInput
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter activity title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <TextArea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the activity"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Scheduled Date
              </label>
              <TextInput
                type="date"
                name="scheduled_date"
                value={form.scheduled_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <TextInput
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time
              </label>
              <TextInput
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Staff Assignment</h2>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign to Staff Member
            </label>
            <select
              name="assigned_staff_id"
              value={form.assigned_staff_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Staff Member</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate(basePath)}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving..." : id ? "Update Activity" : "Add Activity"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
