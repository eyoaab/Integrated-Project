import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import {
  AlertTriangle,
  Car,
  Hospital,
  MessageSquare,
  History,
  Settings as SettingsIcon,
  FileText,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { TabType } from "../types";

interface SidebarProps {
  onTabChange: (tab: TabType) => void;
  activeTab: TabType;
}

export const Sidebar = ({ onTabChange, activeTab }: SidebarProps) => {
  const { getUser, logout } = useAuth();
  const user = getUser();

  return (
    <div className="sticky top-0 h-screen w-64 bg-[#1a1a1a] p-4 flex flex-col">
      {/* Main Section */}
      <div className="space-y-2 flex-1">
        <h2 className="text-sm text-gray-400 mb-4">Main</h2>
        <NavigationMenu>
          <NavigationMenuList className="space-y-2">
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("accidents")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "accidents"
                    ? "bg-red-900/20 text-red-500"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <AlertTriangle size={20} />
                <span>Accidents</span>
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("hospitals")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "hospitals"
                    ? "bg-blue-900/20 text-blue-500"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <Hospital size={20} />
                <span>Hospitals</span>
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("vehicles")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "vehicles"
                    ? "bg-[#252525] text-white"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <Car size={20} />
                <span>Vehicles</span>
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("reports")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "reports"
                    ? "bg-green-900/20 text-green-500"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <FileText size={20} />
                <span>Reports</span>
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Management Section */}
        <h2 className="text-sm text-gray-400 mb-4 mt-8">Management</h2>
        <NavigationMenu>
          <NavigationMenuList className="space-y-2">
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("emergency")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "emergency"
                    ? "bg-purple-900/20 text-purple-500"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <MessageSquare size={20} />
                <span>Emergency Contacts</span>
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-800 text-white">
                <History size={20} />
                <span>History</span>
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => onTabChange("settings")}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "settings"
                    ? "bg-[#1E1E1E] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Admin Account Section */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">Dispatch Officer</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
