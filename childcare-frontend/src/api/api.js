import axios from "axios";

// ---------------- Dynamic Base API ----------------
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://childcare-management.onrender.com");

console.log("✅ Using API base:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic error handler
const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  throw error;
};

// ---------------- AUTH ----------------
export const authApi = {
  changePassword: async (data) =>
  api.put("/auth/change-password", data).then((res) => res.data).catch(handleError),

  adminChangePassword: async (userId, data) =>
  api.put(`/auth/admin/change-password/${userId}`, data).then((res) => res.data).catch(handleError),

  getAvailableStaffUsers: async () =>
  api.get("/auth/available-staff-users").then((res) => res.data).catch(handleError),

  getAll: async () =>
  api.get("/auth/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/auth/${id}`).then((res) => res.data).catch(handleError),

  register: async (data) =>
    api.post("/auth/register", data).then((res) => res.data).catch(handleError),

  login: async (data) =>
    api.post("/auth/login", data).then((res) => res.data).catch(handleError),

  getMe: async () =>
    api.get("/auth/me").then((res) => res.data).catch(handleError),

  updateUser: async (userId, data) =>
    api.put(`/auth/update/${userId}`, data).then((res) => res.data).catch(handleError),

  deleteUser: async (userId) =>
    api.delete(`/auth/${userId}`).then((res) => res.data).catch(handleError),
};

// ---------------- CHILDREN ----------------
export const childrenApi = {
  getAll: async () =>
    api.get("/children/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/children/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) =>
    api.post("/children/", data).then((res) => res.data).catch(handleError),

  update: async (id, data) =>
    api.put(`/children/${id}`, data).then((res) => res.data).catch(handleError),

  delete: async (id) =>
    api.delete(`/children/${id}`).then((res) => res.data).catch(handleError),
};

// ---------------- STAFF ----------------
export const staffApi = {
  getAll: async () =>
    api.get("/staff/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/staff/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) =>
    api.post("/staff/", data).then((res) => res.data).catch(handleError),

  update: async (id, data) =>
    api.put(`/staff/${id}`, data).then((res) => res.data).catch(handleError),

  delete: async (id) =>
    api.delete(`/staff/${id}`).then((res) => res.data).catch(handleError),
};

// ---------------- ATTENDANCE ----------------
export const attendanceApi = {
  getAll: async () =>
    api.get("/attendance/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/attendance/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) => {
    const payload = normalizeAttendancePayload(data);
    return api.post("/attendance/", payload).then((res) => res.data).catch(handleError);
  },

  update: async (id, data) => {
    const payload = normalizeAttendancePayload(data);
    return api.put(`/attendance/${id}`, payload).then((res) => res.data).catch(handleError);
  },

  delete: async (id) =>
    api.delete(`/attendance/${id}`).then((res) => res.data).catch(handleError),
};

// ✅ helper to ensure correct format
function normalizeAttendancePayload(data) {
  const fixTime = (t) => {
    if (!t) return null;
    return t.length === 8 ? t.slice(0, 5) : t; // "HH:MM:SS" → "HH:MM"
  };

  return {
    ...data,
    date: data.date ? data.date.toString().slice(0, 10) : null, // ensure "YYYY-MM-DD"
    check_in: fixTime(data.check_in),
    check_out: fixTime(data.check_out),
  };
}


// ---------------- HEALTH RECORDS ----------------
export const healthRecordsApi = {
  getAll: async () =>
    api.get("/health-records/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/health-records/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) =>
    api.post("/health-records/", data).then((res) => res.data).catch(handleError),

  update: async (id, data) =>
    api.put(`/health-records/${id}`, data).then((res) => res.data).catch(handleError),

  delete: async (id) =>
    api.delete(`/health-records/${id}`).then((res) => res.data).catch(handleError),
};

// ---------------- ACTIVITIES ----------------
export const activitiesApi = {
  getAll: async () =>
    api.get("/activities/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/activities/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) =>
    api.post("/activities/", data).then((res) => res.data).catch(handleError),

  update: async (id, data) =>
    api.put(`/activities/${id}`, data).then((res) => res.data).catch(handleError),

  delete: async (id) =>
    api.delete(`/activities/${id}`).then((res) => res.data).catch(handleError),
};

// ---------------- BILLING ----------------
export const billingApi = {
  getAll: async () =>
    api.get("/billing/").then((res) => res.data).catch(handleError),

  getById: async (id) =>
    api.get(`/billing/${id}`).then((res) => res.data).catch(handleError),

  create: async (data) =>
    api.post("/billing/", data).then((res) => res.data).catch(handleError),

  update: async (id, data) =>
    api.put(`/billing/${id}`, data).then((res) => res.data).catch(handleError),

  delete: async (id) =>
    api.delete(`/billing/${id}`).then((res) => res.data).catch(handleError),
};

export default api;
