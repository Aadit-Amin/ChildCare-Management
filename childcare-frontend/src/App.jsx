import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Layouts
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";

// ✅ Admin pages
import Settings from "./pages/Admin/Settings";
import StaffList from "./pages/Staff/StaffList";
import StaffForm from "./pages/Staff/StaffForm";
import UserManagement from "./pages/Admin/UserManagement";
import UserForm from "./pages/Admin/UserForm";

// ✅ Shared pages (used by both admin & staff)
import ChildrenList from "./pages/Children/ChildrenList";
import ChildForm from "./pages/Children/ChildForm";
import ChildDetails from "./pages/Children/ChildDetails";

import AttendanceList from "./pages/Attendance/AttendanceList";
import AttendanceForm from "./pages/Attendance/AttendanceForm";

import ActivitiesList from "./pages/Activities/ActivitiesList";
import ActivityForm from "./pages/Activities/ActivityForm";

import HealthRecordsList from "./pages/Health/HealthRecordsList";
import HealthRecordForm from "./pages/Health/HealthRecordForm";

import BillingList from "./pages/Billing/BillingList";
import BillingForm from "./pages/Billing/BillingForm";

// ✅ Staff settings (NEW)
import StaffSettings from "./pages/Staff/Settings";

// ✅ Fallback
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Default route redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ====================== ADMIN ROUTES ====================== */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Staff Management */}
        <Route path="/admin/staff" element={<StaffList />} />
        <Route path="/admin/staff/new" element={<StaffForm />} />
        <Route path="/admin/staff/edit/:id" element={<StaffForm />} />

        {/* User Management */}
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/new" element={<UserForm />} />
        <Route path="/admin/users/edit/:id" element={<UserForm />} />

        {/* Children */}
        <Route path="/admin/children" element={<ChildrenList />} />
        <Route path="/admin/children/new" element={<ChildForm />} />
        <Route path="/admin/children/edit/:id" element={<ChildForm />} />
        <Route path="/admin/children/:id" element={<ChildDetails />} />

        {/* Attendance */}
        <Route path="/admin/attendance" element={<AttendanceList />} />
        <Route path="/admin/attendance/new" element={<AttendanceForm />} />
        <Route path="/admin/attendance/edit/:id" element={<AttendanceForm />} />

        {/* Activities */}
        <Route path="/admin/activities" element={<ActivitiesList />} />
        <Route path="/admin/activities/new" element={<ActivityForm />} />
        <Route path="/admin/activities/edit/:id" element={<ActivityForm />} />

        {/* Health Records */}
        <Route path="/admin/health" element={<HealthRecordsList />} />
        <Route path="/admin/health/new" element={<HealthRecordForm />} />
        <Route path="/admin/health/edit/:id" element={<HealthRecordForm />} />

        {/* Billing */}
        <Route path="/admin/billing" element={<BillingList />} />
        <Route path="/admin/billing/new" element={<BillingForm />} />
        <Route path="/admin/billing/edit/:id" element={<BillingForm />} />
      </Route>

      {/* ====================== STAFF ROUTES ====================== */}
      <Route
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/staff" element={<Dashboard />} />
        {/* ✅ Use the new Staff Settings component */}
        <Route path="/staff/settings" element={<StaffSettings />} />

        {/* Children */}
        <Route path="/staff/children" element={<ChildrenList />} />
        <Route path="/staff/children/new" element={<ChildForm />} />
        <Route path="/staff/children/edit/:id" element={<ChildForm />} />
        <Route path="/staff/children/:id" element={<ChildDetails />} />

        {/* Attendance */}
        <Route path="/staff/attendance" element={<AttendanceList />} />
        <Route path="/staff/attendance/new" element={<AttendanceForm />} />
        <Route path="/staff/attendance/edit/:id" element={<AttendanceForm />} />

        {/* Activities */}
        <Route path="/staff/activities" element={<ActivitiesList />} />
        <Route path="/staff/activities/new" element={<ActivityForm />} />
        <Route path="/staff/activities/edit/:id" element={<ActivityForm />} />

        {/* Health Records */}
        <Route path="/staff/health" element={<HealthRecordsList />} />
        <Route path="/staff/health/new" element={<HealthRecordForm />} />
        <Route path="/staff/health/edit/:id" element={<HealthRecordForm />} />

        {/* Billing */}
        <Route path="/staff/billing" element={<BillingList />} />
        <Route path="/staff/billing/new" element={<BillingForm />} />
        <Route path="/staff/billing/edit/:id" element={<BillingForm />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
