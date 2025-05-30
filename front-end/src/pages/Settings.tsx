import { useState } from "react";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

type SettingsTab = "general" | "account" | "notification" | "security";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-[#252525]"
    }`}
  >
    {children}
  </button>
);

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "account":
        return <AccountSettings />;
      case "notification":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-2">
              Manage your account settings and configure system preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#252525] pb-4">
              <TabButton
                active={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              >
                General
              </TabButton>
              <TabButton
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
              >
                Account
              </TabButton>
              <TabButton
                active={activeTab === "notification"}
                onClick={() => setActiveTab("notification")}
              >
                Notification
              </TabButton>
              <TabButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
              >
                Security
              </TabButton>
            </div>

            {/* Content */}
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
