import { useState } from "react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { VehiclesPage } from "./pages/Vehicles";
import { AccidentsPage } from "./pages/Accidents";
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
      ) : (
        <AccidentsPage />
      )}
    </DashboardLayout>
  );
}
