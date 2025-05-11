import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import type { TabType } from "../types";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddVehicle?: () => void;
}

export const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  onAddVehicle,
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-6 justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "vehicles" ? "Vehicles" : "Active Accidents"}
              </h1>
              <p className="text-gray-400 mt-2">
                {activeTab === "vehicles"
                  ? "Monitor and manage all vehicles in the emergency response network"
                  : "Real-time accident monitoring and response"}
              </p>
            </div>
            {activeTab === "vehicles" && onAddVehicle && (
              <button
                onClick={onAddVehicle}
                className="px-4 py-2 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Vehicle
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 pb-8">{children}</div>
      </main>
    </div>
  );
};
