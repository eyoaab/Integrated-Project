import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddEmergencyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEmergencyDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: AddEmergencyDialogProps) => {
  const [loading, setLoading] = useState(false);

  const officeTypes = [
    "Fire Department",
    "Police Department",
    "Ambulance Service",
    "Vehicle Owner Services",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const payload = {
        name: formData.get("name"),
        role: formData.get("role"),
        office_type: formData.get("office_type"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        office_name: formData.get("office_name"),
      };

      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/emergency-offices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add emergency contact");
      }

      const data = await response.json();

      toast.success("Emergency Contact Added Successfully", {
        description: `${data.data.name} has been added as ${data.data.role} at ${data.data.office_name}`,
        duration: 5000,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to Add Emergency Contact", {
        description:
          error instanceof Error ? error.message : "An error occurred",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add Emergency Contact
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-400 mb-1"
              >
                Contact Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm text-gray-400 mb-1"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter role"
                defaultValue="Emergency Coordinator"
              />
            </div>

            <div>
              <label
                htmlFor="office_type"
                className="block text-sm text-gray-400 mb-1"
              >
                Office Type
              </label>
              <select
                id="office_type"
                name="office_type"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {officeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-400 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm text-gray-400 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label
                htmlFor="office_name"
                className="block text-sm text-gray-400 mb-1"
              >
                Office Name
              </label>
              <input
                type="text"
                id="office_name"
                name="office_name"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter office name"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Contact"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
