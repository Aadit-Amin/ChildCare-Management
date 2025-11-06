import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { healthRecordsApi, childrenApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Heart, 
  Calendar, 
  User, 
  Stethoscope,
  FileText,
  Download
} from "lucide-react";
import TextInput from "../../components/TextInput";

export default function HealthRecordsList() {
  const [records, setRecords] = useState([]);
  const [children, setChildren] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);

  // ✅ Fetch all health records and all children
  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, childrenData] = await Promise.all([
        healthRecordsApi.getAll(),
        childrenApi.getAll(),
      ]);

      const childMap = {};
      childrenData.forEach((child) => {
        childMap[child.id] = child.name;
      });

      setRecords(recordsData);
      setChildren(childMap);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch health records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await healthRecordsApi.delete(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      alert("Record deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete record.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  // ✅ Admin → /admin/health, Staff → /staff/health
  const basePath = user?.role === "admin" ? "/admin/health" : "/staff/health";

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    const childName = children[record.child_id] || "";
    return childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate stats
  const totalRecords = records.length;
  const recentRecords = records.filter(r => {
    const recordDate = new Date(r.record_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recordDate >= thirtyDaysAgo;
  }).length;

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
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Track medical information and health history</p>
        </div>
        <Link
          to={`${basePath}/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Record
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Records</p>
              <p className="text-2xl font-bold text-gray-900">{recentRecords}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div 
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TextInput
          type="text"
          placeholder="Search by child name, description, or doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          iconPosition="left"
          className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
        />
      </motion.div>

      {/* Health Records Table */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
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
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {children[record.child_id] || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        <span className="truncate max-w-xs">{record.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Stethoscope className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        {record.doctor_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        {new Date(record.record_date).toLocaleDateString()}
                      </div>
                    </td>
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
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td colSpan="5" className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first health record."}
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
