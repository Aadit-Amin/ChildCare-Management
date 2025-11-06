import React, { useEffect, useState } from "react";
import { staffApi } from "../../api/api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Phone, 
  Briefcase,
  MapPin,
  Mail,
  Download
} from "lucide-react";

export default function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffApi.getAll();
      setStaffList(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch staff list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await staffApi.delete(id);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete staff.");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (loading) return <Loader />;

  const filteredStaff = staffList.filter(staff => 
    (staff.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.position?.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your team and staff members</p>
        </div>
        <Link
          to="/admin/staff/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Staff
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
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Staff Members</p>
            <p className="text-2xl font-bold text-gray-900">{staffList.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
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
              placeholder="Search by name, email, or position..."
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

      {/* Staff Table */}
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
                  Staff Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff, index) => (
                <motion.tr 
                  key={staff.id} 
                  className="hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.user ? (
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{staff.user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {staff.user.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Unknown User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      <span className="text-sm text-gray-900">{staff.position || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      {staff.contact || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                      {staff.assigned_room || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/staff/edit/${staff.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-medium">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(staff.id)}
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
        
        {filteredStaff.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Try adjusting your search criteria." 
                : "Get started by adding your first staff member."
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/staff/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Staff
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
