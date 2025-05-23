import { useState } from "react";
import { Globe, Save } from "lucide-react";

export const GeneralSettings = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [language, setLanguage] = useState("English");
  const [autoDispatch, setAutoDispatch] = useState(false);
  const [refreshRate, setRefreshRate] = useState("Every 5 Seconds");

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving settings:", {
      theme,
      language,
      autoDispatch,
      refreshRate,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Theme Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-medium">Theme</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded-md text-sm ${
              theme === "light"
                ? "bg-white text-black"
                : "bg-[#252525] text-white hover:bg-[#303030]"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded-md text-sm ${
              theme === "dark"
                ? "bg-white text-black"
                : "bg-[#252525] text-white hover:bg-[#303030]"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`px-4 py-2 rounded-md text-sm ${
              theme === "system"
                ? "bg-white text-black"
                : "bg-[#252525] text-white hover:bg-[#303030]"
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-medium">Language</h3>
        <div className="flex items-center gap-2 text-gray-400">
          <Globe className="w-4 h-4" />
          <span className="text-sm">System Language</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-[#252525] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>English</option>
          <option>Amharic</option>
          <option>Arabic</option>
          <option>French</option>
        </select>
      </div>

      {/* Auto-Dispatch Toggle */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-medium">Auto-Dispatch</h3>
        <p className="text-sm text-gray-400">Enable Auto-Dispatch</p>
        <p className="text-xs text-gray-400 mb-2">
          Automatically dispatch emergency services for critical incidents
        </p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoDispatch}
            onChange={(e) => setAutoDispatch(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#252525] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Data Refresh Rate */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-medium">Data Refresh Rate</h3>
        <select
          value={refreshRate}
          onChange={(e) => setRefreshRate(e.target.value)}
          className="w-full px-3 py-2 bg-[#252525] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Every 5 Seconds</option>
          <option>Every 10 Seconds</option>
          <option>Every 30 Seconds</option>
          <option>Every Minute</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};
