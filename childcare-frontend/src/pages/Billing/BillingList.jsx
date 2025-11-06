import React, { useEffect, useState, useContext } from "react";
import { billingApi, childrenApi } from "../../api/api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { formatCurrency, formatDateDMY } from "../../utils/formatters";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import TextInput from "../../components/TextInput";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download
} from "lucide-react";

export default function BillingList() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [billingRecords, setBillingRecords] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const data = await billingApi.getAll();
      setBillingRecords(data);

      const childrenData = await childrenApi.getAll();
      const map = {};
      childrenData.forEach((c) => (map[c.id] = c.name));
      setChildrenMap(map);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch billing records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this billing record?")) return;
    try {
      await billingApi.delete(id);
      setBillingRecords(billingRecords.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete billing record.");
    }
  };

  useEffect(() => { fetchBilling(); }, []);

  if (loading) return <Loader />;

  // Filter records based on search term
  const filteredRecords = billingRecords.filter(record => {
    const childName = childrenMap[record.child_id] || "";
    return childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate stats
  const totalAmount = billingRecords.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
  const paidAmount = billingRecords.filter(r => r.status?.toLowerCase() === 'paid').reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
  const unpaidAmount = totalAmount - paidAmount; // Unpaid = Total - Paid (includes Pending + Overdue)

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
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
          <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
          <p className="text-gray-600 mt-1">Track payments and invoices</p>
        </div>
        {isAdmin && (
          <Link 
            to="/admin/billing/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Billing
          </Link>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
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
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidAmount)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(unpaidAmount)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div 
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <TextInput
          type="text"
          placeholder="Search by child name, status, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          iconPosition="left"
        />
      </motion.div>

      {/* Billing Table */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notes
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
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
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {childrenMap[record.child_id] || "Unknown Child"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        <span className="font-semibold">{formatCurrency(record.amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        {formatDateDMY(record.issued_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        {formatDateDMY(record.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="w-4 h-4 mr-2 text-gray-300 pointer-events-none" />
                        <span className="truncate max-w-xs">{record.notes || "-"}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-left whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/billing/edit/${record.id}`}
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
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No billing records found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first billing record."}
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
