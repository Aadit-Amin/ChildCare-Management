import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { childrenApi } from "../../api/api";
import Loader from "../../components/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  Edit,
  ArrowLeft,
  Baby,
  Users,
  FileText,
  Shield
} from "lucide-react";

export default function ChildDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  const basePath = user?.role === "admin" ? "/admin/children" : "/staff/children";

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const data = await childrenApi.getById(id);
        setChild(data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch child data.");
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  if (loading) return <Loader />;
  if (!child) return <p className="p-6">Child not found.</p>;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <motion.div 
      className="space-y-10"
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
        <Link
          to={basePath}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{child.name}</h1>
          <p className="text-gray-600 mt-1">Child profile and information</p>
        </div>
        <Link
          to={`${basePath}/edit/${child.id}`}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Child
        </Link>
      </motion.div>

      {/* Child Profile Card */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Baby className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{child.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{calculateAge(child.dob)} years old</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="capitalize">{child.gender}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Basic Information */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-300 pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                <p className="text-sm text-gray-900">{child.dob}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-300 pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-gray-600">Gender</p>
                <p className="text-sm text-gray-900 capitalize">{child.gender}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-300 pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-sm text-gray-900">{child.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Parent Information */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Parent Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-300 pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-gray-600">Parent Name</p>
                <p className="text-sm text-gray-900">{child.parent_name || "Not provided"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-300 pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-gray-600">Parent Contact</p>
                <p className="text-sm text-gray-900">{child.parent_contact || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Medical Information */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
        </div>

        <div className="space-y-6 mt-6">
          <div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Allergies</p>
                <p className="text-sm text-gray-900">
                  {child.allergies || "No known allergies"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Medical Information</p>
                <p className="text-sm text-gray-900">
                  {child.medical_info || "No additional medical information"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Link
        to={`${basePath}/edit/${child.id}`}
        className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
      >
        <Edit className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">Edit Profile</span>
      </Link>
          
          <Link
            to={`${user?.role === "admin" ? "/admin" : "/staff"}/attendance/new?child_id=${child.id}`}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Add Attendance</span>
          </Link>
          
          <Link
            to={`${user?.role === "admin" ? "/admin" : "/staff"}/health/new?child_id=${child.id}`}
            className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Add Health Record</span>
      </Link>
    </div>
      </motion.div>
    </motion.div>
  );
}
