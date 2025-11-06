import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  Users,
  Baby
} from "lucide-react";

export default function NotFound() {
  const { user } = useContext(AuthContext);

  // Determine dashboard path based on role
  const dashboardPath = user?.role === "admin" ? "/admin" : "/staff";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div 
        className="bg-white shadow-2xl rounded-3xl p-12 text-center max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div 
          className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AlertTriangle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Error Code */}
        <motion.h1 
          className="text-8xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Oops! The page you are looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to={dashboardPath}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors w-full justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors w-full justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </motion.div>

        {/* Help Section */}
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Need Help?</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Contact Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Baby className="w-4 h-4" />
              <span>Childcare Help</span>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-200 rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>
    </div>
  );
}
