import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#222", color: "white", padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="map">Threat Map</Link></li>
          <li><Link to="log">Incident Log</Link></li>
          <li><Link to="config">Rule Config</Link></li>
        </ul>
      </div>

      {/* Dynamic pages load here */}
      <div style={{ padding: "20px", flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
