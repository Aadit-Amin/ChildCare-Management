    import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-600" : "hover:text-blue-500"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
