import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { childrenApi, staffApi, attendanceApi } from "../../api/api";
import {
  User,
  Users,
  Activity,
  CalendarCheck,
  Heart,
  FileText,
  Settings,
  TrendingUp,
  Baby,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalStaff: 0,
    todayAttendance: 0,
    loading: true
  });

  const isAdmin = user?.role === "admin";

  // Fetch real statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));
        const [childrenData, staffData, attendanceData] = await Promise.all([
          childrenApi.getAll(),
          staffApi.getAll(),
          attendanceApi.getAll(),
        ]);

        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceData.filter(a => a.date === today).length;

        setStats({
          totalChildren: childrenData.length,
          totalStaff: staffData.length,
          todayAttendance,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    { title: "Total Children", value: stats.totalChildren, icon: User, color: "blue" },
    { title: "Active Staff", value: stats.totalStaff, icon: Users, color: "green" },
  ];

  const adminLinks = [
    { name: "Children", path: "/admin/children", icon: User, color: "blue", description: "Manage children profiles" },
    { name: "Staff", path: "/admin/staff", icon: Users, color: "green", description: "Staff management" },
    { name: "Attendance", path: "/admin/attendance", icon: CalendarCheck, color: "yellow", description: "Track daily attendance" },
    { name: "Health Records", path: "/admin/health", icon: Heart, color: "red", description: "Medical records" },
    { name: "Activities", path: "/admin/activities", icon: Activity, color: "purple", description: "Plan activities" },
    { name: "Billing", path: "/admin/billing", icon: FileText, color: "pink", description: "Payment management" },
    { name: "User Management", path: "/admin/users", icon: Users, color: "orange", description: "User accounts" },
    { name: "Settings", path: "/admin/settings", icon: Settings, color: "gray", description: "System settings" },
  ];

  const staffLinks = [
    { name: "Children", path: "/staff/children", icon: User, color: "blue", description: "View children profiles" },
    { name: "Attendance", path: "/staff/attendance", icon: CalendarCheck, color: "yellow", description: "Mark attendance" },
    { name: "Activities", path: "/staff/activities", icon: Activity, color: "purple", description: "Activity management" },
    { name: "Health Records", path: "/staff/health", icon: Heart, color: "red", description: "Health monitoring" },
    { name: "Billing", path: "/staff/billing", icon: FileText, color: "pink", description: "Payment records" },
    { name: "Settings", path: "/staff/settings", icon: Settings, color: "gray", description: "Personal settings" },
  ];

  const links = isAdmin ? adminLinks : staffLinks;

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600", 
      yellow: "from-yellow-500 to-yellow-600",
      red: "from-red-500 to-red-600",
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      orange: "from-orange-500 to-orange-600",
      gray: "from-gray-500 to-gray-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header with Image */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-blue-100">
              {isAdmin ? "Here's what's happening in your childcare center today." : "Here's your daily overview."}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center relative overflow-hidden">
              <Baby className="w-10 h-10 z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index} 
              className="bg-slate-800 rounded-lg p-6 hover:shadow-md transition-shadow border border-slate-700 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-900/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ml-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-700 overflow-hidden relative">
            {/* Background decorative image placeholder */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-900/20 to-green-900/20 opacity-30 rounded-bl-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {links.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className="group p-6 rounded-xl border border-slate-600 hover:border-slate-500 hover:shadow-md transition-all duration-200 block bg-slate-700 relative overflow-hidden"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(link.color)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-gray-200 mb-1">{link.name}</h3>
                            <p className="text-sm text-gray-400">{link.description}</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Card with Tips */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-lg p-6 shadow-sm border border-purple-800/50 relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/30 opacity-20 rounded-bl-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Tips</h2>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p>Mark daily attendance before morning activities</p>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p>Update health records after medical checkups</p>
              </div>
              <div className="flex items-start gap-2">
                <Baby className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p>Keep children information updated regularly</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
