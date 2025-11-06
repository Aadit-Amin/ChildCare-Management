import React, { useEffect, useState, useContext } from "react";
import { activitiesApi, staffApi } from "../../api/api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User,
  Download,
  Activity
} from "lucide-react";

export default function ActivitiesList() {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesApi.getAll();
      setActivities(data);

      const staffData = await staffApi.getAll();
      const staffMap = {};
      staffData.forEach((s) => (staffMap[s.id] = s.user.name));
      setStaff(staffMap);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await activitiesApi.delete(id);
      setActivities(activities.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete activity.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <Loader />;

  const basePath = user?.role === "staff" ? "/staff/activities" : "/admin/activities";

  const filteredActivities = activities.filter(activity => 
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Manage scheduled activities and programs</p>
        </div>
        <Link
          to={`${basePath}/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Activity
        </Link>
      </motion.div>

      {/* Stats Card */}
      <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Activities</p>
            <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              iconPosition="left"
            />
          </div>
          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Activities Table */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assigned Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <motion.tr 
                  key={activity.id} 
                  className="hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{activity.title}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-600 truncate">{activity.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      {activity.scheduled_date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      {activity.start_time} - {activity.end_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      {staff[activity.assigned_staff_id] || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`${basePath}/edit/${activity.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-medium">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredActivities.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Try adjusting your search criteria." 
                : "Get started by adding your first activity."
              }
            </p>
            {!searchTerm && (
              <Link
                to={`${basePath}/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Activity
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
