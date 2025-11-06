import React, { useEffect, useState, useContext } from "react";
import { attendanceApi, childrenApi } from "../../api/api";
import Loader from "../../components/Loader";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function AttendanceList() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  const [records, setRecords] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceApi.getAll();
      setRecords(data);

      const childrenData = await childrenApi.getAll();
      const map = {};
      childrenData.forEach((c) => (map[c.id] = c.name));
      setChildrenMap(map);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await attendanceApi.delete(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance record.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <Loader />;

  const basePath = isAdmin ? "/admin/attendance" : "/staff/attendance";

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    const childName = childrenMap[record.child_id] || "";
    return (
      childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate total count
  const totalRecords = records.length;

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'present':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'absent':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'late':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-600 mt-1">Track daily attendance and check-ins</p>
        </div>
        {(isAdmin || isStaff) && (
          <Link
            to={`${basePath}/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Record
          </Link>
        )}
      </motion.div>

      {/* Stats Cards (Only Total Records) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div 
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TextInput
          type="text"
          placeholder="Search by child name, date, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          iconPosition="left"
        />
      </motion.div>

      {/* Attendance Table */}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Child</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                {(isAdmin || isStaff) && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <motion.tr 
                    key={record.id}
                    className="hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4 text-sm font-semibold text-gray-900">
                          {childrenMap[record.child_id] || "Unknown Child"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300" />
                        {record.date}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-300" />
                        {record.check_in || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-300" />
                        {record.check_out || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </span>
                    </td>

                    {(isAdmin || isStaff) && (
                      <td className="px-6 py-4 text-left whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`${basePath}/edit/${record.id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-medium">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td colSpan={isAdmin || isStaff ? 6 : 5} className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search criteria."
                        : "Get started by adding your first attendance record."}
                    </p>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
