import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // TODO: Implement password change functionality
    console.log("Changing password:", formData);
    toast.success("Password changed successfully");

    // Clear form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-white text-lg font-medium mb-1">
            Security Settings
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your account security and password.
          </p>
        </div>

        {/* Change Password */}
        <div className="bg-[#252525] rounded-lg p-6">
          <h3 className="text-white text-base font-medium mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm text-gray-400 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1E1E1E] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm text-gray-400 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1E1E1E] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-400 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1E1E1E] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-[#252525] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-base font-medium">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-[#1E1E1E] rounded-lg">
              <p className="text-sm text-gray-400">
                Two-factor authentication is enabled. You will be required to
                enter a verification code when logging in.
              </p>
            </div>
          )}
        </div>

        {/* Session Management */}
        <div className="bg-[#252525] rounded-lg p-6">
          <h3 className="text-white text-base font-medium mb-2">
            Session Management
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Manage your active sessions and sign out from other devices
          </p>
          <button className="text-red-500 hover:text-red-400 text-sm font-medium">
            Sign out from all other devices
          </button>
        </div>
      </div>
    </div>
  );
};
