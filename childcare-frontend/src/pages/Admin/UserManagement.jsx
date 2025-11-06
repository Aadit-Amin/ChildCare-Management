import React, { useEffect, useState } from "react";
import { staffApi, authApi } from "../../api/api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  User, 
  Mail, 
  Shield,
  Download
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  // Fetch all staff/users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authApi.getAll(); // ✅ Fetch from /auth/
      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to fetch users." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await authApi.deleteUser(id); // ✅ Delete via /auth/{id}
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage({ type: "success", text: "User deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error);
      // Extract error message from API response
      const errorMessage = error.response?.data?.detail || error.message || "Failed to delete user.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  const filteredUsers = users
    .filter((u) => u.role?.toLowerCase() !== 'admin') // Exclude admin users
    .filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    fetchUsers();
  }, []);

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and roles</p>
        </div>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Link>
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

      {/* Stats Card */}
      <motion.div 
        className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TextInput
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          iconPosition="left"
        />
      </motion.div>

      {/* Users Table */}
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
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, index) => (
                  <motion.tr 
                    key={u.id} 
                    className="hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {u.role || "staff"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/users/edit/${u.id}`}
                          state={{ userData: u }}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-xs font-medium">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(u.id)}
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
                  <td colSpan={4} className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">
                      {search ? "Try adjusting your search criteria." : "Get started by adding your first user."}
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
