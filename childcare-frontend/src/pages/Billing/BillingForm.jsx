import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { billingApi, childrenApi } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  User,
  Calendar,
  FileText,
  Save,
  ArrowLeft
} from "lucide-react";

export default function BillingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [form, setForm] = useState({
    child_id: "",
    amount: "",
    status: "Pending",
    issued_date: "",
    due_date: "",
    notes: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const childrenData = await childrenApi.getAll();
        setChildren(childrenData);
        
        if (id) {
          const record = await billingApi.getById(id);
          setForm({
            child_id: record.child_id,
            amount: record.amount,
            status: record.status,
            issued_date: record.issued_date.split('T')[0],
            due_date: record.due_date.split('T')[0],
            notes: record.notes || ""
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await billingApi.update(id, form);
        alert("Billing updated successfully!");
      } else {
        await billingApi.create(form);
        alert("Billing created successfully!");
      }
      navigate("/admin/billing");
    } catch (error) {
      console.error(error);
      alert("Failed to save billing.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.child_id && id) return <Loader />;

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
          onClick={() => navigate("/admin/billing")}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? "Edit Billing" : "Add Billing"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? "Update billing information" : "Create a new billing record"}
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
          {/* Child Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
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

          {/* Billing Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Billing Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-gray-700"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issued Date
                </label>
                <input
                  type="date"
                  name="issued_date"
                  value={form.issued_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/billing")}
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
              <span>{loading ? "Saving..." : id ? "Update Billing" : "Add Billing"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
