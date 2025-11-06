import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { childrenApi } from "../../api/api";
import Loader from "../../components/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  Save, 
  ArrowLeft,
  Baby
} from "lucide-react";

export default function ChildForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ get logged-in user info
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    parent_name: "",
    parent_contact: "",
    address: "",
    allergies: "",
    medical_info: "",
  });

  // Fetch a specific child when editing
  const fetchChild = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await childrenApi.getById(id);
      setForm({
        name: data.name || "",
        dob: data.dob || "",
        gender: data.gender || "",
        parent_name: data.parent_name || "",
        parent_contact: data.parent_contact || "",
        address: data.address || "",
        allergies: data.allergies || "",
        medical_info: data.medical_info || "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch child data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChild();
  }, [fetchChild]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await childrenApi.update(id, form);
        alert("Child updated successfully.");
      } else {
        await childrenApi.create(form);
        alert("Child created successfully.");
      }

      // ✅ Redirect based on role
      const basePath = user?.role === "admin" ? "/admin/children" : "/staff/children";
      navigate(basePath);

    } catch (error) {
      console.error(error);
      alert("Failed to save child.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const basePath = user?.role === "admin" ? "/admin/children" : "/staff/children";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
              {id ? "Edit Child" : "Add New Child"}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? "Update child information" : "Create a new child profile"}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
          <Baby className="w-4 h-4" />
          <span>Child Management</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Name *
                </label>
                <TextInput
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter child's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <TextInput
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  icon={Calendar}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Parent Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent/Guardian Name *
                </label>
                <TextInput
                  type="text"
                  name="parent_name"
                  value={form.parent_name}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter parent or guardian name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <TextInput
                  type="tel"
                  name="parent_contact"
                  value={form.parent_contact}
                  onChange={handleChange}
                  icon={Phone}
                  iconPosition="left"
                  className="border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <TextArea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter home address"
                  icon={MapPin}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Allergies
              </label>
              <TextArea
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                rows={4}
                placeholder="List any known allergies or leave blank if none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Heart className="w-4 h-4 inline mr-1" />
                Medical Information
              </label>
              <TextArea
                name="medical_info"
                value={form.medical_info}
                onChange={handleChange}
                rows={4}
                placeholder="Any medical conditions, medications, or special care instructions"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
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
            <span>{loading ? "Saving..." : id ? "Update Child" : "Add Child"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}




