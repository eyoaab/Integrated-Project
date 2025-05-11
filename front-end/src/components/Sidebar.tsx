import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { Car, AlertTriangle } from "lucide-react";

interface SidebarProps {
  onTabChange: (tab: "vehicles" | "accidents") => void;
  activeTab: "vehicles" | "accidents";
}

export const Sidebar = ({ onTabChange, activeTab }: SidebarProps) => {
  return (
    <div className="sticky top-0 h-screen w-64 bg-[#1a1a1a] p-4 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xl font-semibold text-white">
          Emergency Dashboard
        </span>
      </div>

      <div className="space-y-2">
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
                onClick={() => onTabChange("vehicles")}
                className={`flex items-center gap-2 w-full p-2 rounded-lg ${
                  activeTab === "vehicles"
                    ? "bg-blue-900/20 text-blue-500"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <Car size={20} />
                <span>Vehicles</span>
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
