import { useState } from "react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { VehiclesPage } from "./pages/Vehicles";
import { AccidentsPage } from "./pages/Accidents";
import { HospitalsPage } from "./pages/Hospitals";
import { EmergencyPage } from "./pages/Emergency";
import type { TabType } from "./types";

export default function App() {
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
      ) : (
        <EmergencyPage />
      )}
    </DashboardLayout>
  );
}
