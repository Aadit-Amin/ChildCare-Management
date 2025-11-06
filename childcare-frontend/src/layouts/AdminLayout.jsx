import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CalendarCheck, 
  Heart, 
  Activity, 
  FileText, 
  Settings, 
  UserCog,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme on layout load - default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || "dark";
    document.documentElement.className = savedTheme === "dark" ? "dark" : "";
  }, []);

  // Derive page title from path
  const pageTitle = location.pathname
    .replace("/admin/", "")
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard";

  const navigationItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, color: "text-blue-600" },
    { name: "Children", path: "/admin/children", icon: Users, color: "text-blue-500" },
    { name: "Staff", path: "/admin/staff", icon: UserCheck, color: "text-green-500" },
    { name: "Attendance", path: "/admin/attendance", icon: CalendarCheck, color: "text-yellow-500" },
    { name: "Health Records", path: "/admin/health", icon: Heart, color: "text-red-500" },
    { name: "Activities", path: "/admin/activities", icon: Activity, color: "text-purple-500" },
    { name: "Billing", path: "/admin/billing", icon: FileText, color: "text-pink-500" },
    { name: "User Management", path: "/admin/users", icon: UserCog, color: "text-orange-500" },
    { name: "Settings", path: "/admin/settings", icon: Settings, color: "text-gray-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-50 blur-sm"></div>
                <span className="relative text-2xl">👶</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">KidsCare</h2>
                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span className="text-base">👶</span>
              <span className="font-medium">KidsCare Manager © 2024</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 lg:pl-12 lg:pr-12 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
