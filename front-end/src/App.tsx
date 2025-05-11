import { useState } from "react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { VehiclesPage } from "./pages/Vehicles";
import { AccidentsPage } from "./pages/Accidents";
import type { TabType } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("accidents");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "vehicles" ? <VehiclesPage /> : <AccidentsPage />}
    </DashboardLayout>
  );
}
