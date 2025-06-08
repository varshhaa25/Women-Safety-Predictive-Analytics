import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RiskMapPage from "./components/RiskMapPage";
import CrimeDashboard from "./components/CrimeDashboard";
import SafeRoutes from "./components/SafeRoutes";
import VoiceAlert from "./components/VoiceAlert";
import NotFound from "./components/NotFound"; // Optional: Handle 404 pages

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/risk-map" element={<RiskMapPage />} />
        <Route path="/crime-dashboard" element={<CrimeDashboard />} />
        <Route path="/safe-routes" element={<SafeRoutes />} />
        <Route path="/voice-alert" element={<VoiceAlert />} />
        <Route path="*" element={<NotFound />} /> {/* 404 Page */}
      </Routes>
    </Router>
  );
};

export default App;
