import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { VehiclesPage } from "./pages/Vehicles";
import { AccidentsPage } from "./pages/Accidents";
import { HospitalsPage } from "./pages/Hospitals";
import { EmergencyPage } from "./pages/Emergency";
import { ReportsPage } from "./pages/Reports";
import { LoginPage } from "./pages/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import type { TabType } from "./types";
import { Settings } from "./pages/Settings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("accidents");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddVehicle={() => setIsAddVehicleOpen(true)}
    >
      {activeTab === "vehicles" ? (
        <VehiclesPage
          isAddDialogOpen={isAddVehicleOpen}
          onAddDialogClose={() => setIsAddVehicleOpen(false)}
        />
      ) : activeTab === "accidents" ? (
        <AccidentsPage />
      ) : activeTab === "hospitals" ? (
        <HospitalsPage />
      ) : activeTab === "emergency" ? (
        <EmergencyPage />
      ) : activeTab === "settings" ? (
        <Settings />
      ) : (
        <ReportsPage />
      )}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
