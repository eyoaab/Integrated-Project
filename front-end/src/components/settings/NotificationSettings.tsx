import { useState } from "react";
import { Save } from "lucide-react";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const NotificationSettings = () => {
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [notificationTypes, setNotificationTypes] = useState<
    NotificationPreference[]
  >([
    {
      id: "critical",
      label: "Critical Incidents",
      description: "Get notified about severe accidents and emergencies",
      enabled: true,
    },
    {
      id: "moderate",
      label: "Moderate Incidents",
      description: "Get notified about moderate severity incidents",
      enabled: true,
    },
    {
      id: "minor",
      label: "Minor Incidents",
      description: "Get notified about minor incidents and updates",
      enabled: true,
    },
    {
      id: "updates",
      label: "System Updates",
      description: "Get notified about system updates and maintenance",
      enabled: true,
    },
  ]);

  const handleNotificationTypeToggle = (id: string) => {
    setNotificationTypes((prev) =>
      prev.map((type) =>
        type.id === id ? { ...type, enabled: !type.enabled } : type
      )
    );
  };

  const handleSave = () => {
    // TODO: Implement notification settings save functionality
    console.log("Saving notification settings:", {
      emergencyAlerts,
      soundAlerts,
      notificationTypes,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Emergency Alerts */}
      <div className="space-y-4">
        <div className="bg-[#252525] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-sm font-medium">
                Emergency Alerts
              </h3>
              <p className="text-sm text-gray-400">
                Receive notifications for emergency incidents
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emergencyAlerts}
                onChange={(e) => setEmergencyAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-[#252525] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-sm font-medium">Sound Alerts</h3>
              <p className="text-sm text-gray-400">
                Play sound for critical notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">
          Notification Types
        </h3>
        <div className="space-y-3">
          {notificationTypes.map((type) => (
            <div
              key={type.id}
              className="bg-[#252525] rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="text-white text-sm font-medium">{type.label}</h4>
                <p className="text-sm text-gray-400">{type.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={type.enabled}
                  onChange={() => handleNotificationTypeToggle(type.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
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
