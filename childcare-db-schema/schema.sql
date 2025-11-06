-- schema.sql
-- Run this against your 'childcare_db' database.

-- Enable uuid extension if you prefer UUIDs (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users: login accounts (admin, staff, parent)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('admin','staff','parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- staff: additional staff profile data linked to users
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact VARCHAR(50),
  position VARCHAR(100),
  assigned_room VARCHAR(100),
  hire_date DATE
);

-- children: child profiles
CREATE TABLE IF NOT EXISTS children (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dob DATE,
  gender VARCHAR(20),
  parent_name VARCHAR(255),
  parent_contact VARCHAR(100),
  address TEXT,
  allergies TEXT,
  medical_info TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- attendance: daily attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(32) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present','Absent','Late','Excused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (child_id, date) -- ensure only one record per child per date
);

-- health_records: medical notes
CREATE TABLE IF NOT EXISTS health_records (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  doctor_name VARCHAR(255),
  record_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- activities: scheduled activities
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date DATE,
  start_time TIME,
  end_time TIME,
  assigned_staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- billing: fees and payments
CREATE TABLE IF NOT EXISTS billing (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid','Unpaid','Pending','Overdue')),
  issued_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_children_name ON children(name);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_billing_status ON billing(status);
