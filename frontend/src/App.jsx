import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Correct component paths
import LoginForm from "./components/end-user/LoginForm.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ThreatMap from "./components/admin/ThreatMap.jsx";
import IncidentLog from "./components/admin/IncidentLog.jsx";
import RuleConfig from "./components/admin/RuleConfig.jsx";
import './App.css';   

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="map" replace />} />
          <Route path="map" element={<ThreatMap />} />
          <Route path="log" element={<IncidentLog />} />
          <Route path="config" element={<RuleConfig />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
