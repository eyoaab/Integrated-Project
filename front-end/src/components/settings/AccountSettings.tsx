import { useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const AccountSettings = () => {
  const { getUser } = useAuth();
  const user = getUser();

  const [formData, setFormData] = useState({
    firstName: user?.fullname.split(" ")[0] || "",
    lastName: user?.fullname.split(" ")[1] || "",
    email: user?.email || "",
    jobTitle: "Dispatch Officer",
    department: "Administration",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement account update functionality
    console.log("Updating account:", formData);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h2 className="text-white text-lg font-medium mb-1">
          Account Information
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Update your account details and preferences
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm text-gray-400 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm text-gray-400 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm text-gray-400 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm text-gray-400 mb-1"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#252525] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Administration</option>
              <option>Emergency Response</option>
              <option>Dispatch</option>
              <option>Technical Support</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
