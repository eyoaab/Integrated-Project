import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import type { TabType } from "../types";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 flex flex-col">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
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
            <div className="flex items-center gap-4">
              {activeTab === "vehicles" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <span>Add Vehicle</span>
                </button>
              )}
              <button className="p-2 rounded-full bg-[#1E1E1E] hover:bg-[#2E2E2E]">
                <span className="sr-only">Notifications</span>
                {/* Bell icon */}
              </button>
              <button className="p-2 rounded-full bg-[#1E1E1E] hover:bg-[#2E2E2E]">
                <span className="sr-only">Theme</span>
                {/* Sun/Moon icon */}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 pb-8">{children}</div>
      </main>
    </div>
  );
};
