import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddHospitalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddHospitalDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: AddHospitalDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [specialityInput, setSpecialityInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const payload = {
        name: formData.get("name"),
        availableBeds: parseInt(formData.get("availableBeds") as string),
        location_name: formData.get("location_name"),
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
        specialities: specialities,
        phoneNumber: formData.get("phoneNumber"),
      };

      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/hospitals",
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
        throw new Error(errorData.message || "Failed to add hospital");
      }

      const data = await response.json();

      toast.success("Hospital Added Successfully", {
        description: `${data.data.name} has been added with ${data.data.availableBeds} available beds at ${data.data.location_name}`,
        duration: 5000,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to Add Hospital", {
        description:
          error instanceof Error ? error.message : "An error occurred",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const addSpeciality = () => {
    if (
      specialityInput.trim() &&
      !specialities.includes(specialityInput.trim())
    ) {
      setSpecialities([...specialities, specialityInput.trim()]);
      setSpecialityInput("");
    }
  };

  const removeSpeciality = (index: number) => {
    setSpecialities(specialities.filter((_, i) => i !== index));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add New Hospital
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
                Hospital Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hospital name"
              />
            </div>

            <div>
              <label
                htmlFor="availableBeds"
                className="block text-sm text-gray-400 mb-1"
              >
                Available Beds
              </label>
              <input
                type="number"
                id="availableBeds"
                name="availableBeds"
                required
                min="0"
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of available beds"
              />
            </div>

            <div>
              <label
                htmlFor="location_name"
                className="block text-sm text-gray-400 mb-1"
              >
                Location Name
              </label>
              <input
                type="text"
                id="location_name"
                name="location_name"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  required
                  step="any"
                  className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  required
                  step="any"
                  className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter longitude"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Specialities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={specialityInput}
                  onChange={(e) => setSpecialityInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter speciality"
                />
                <button
                  type="button"
                  onClick={addSpeciality}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialities.map((speciality, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#252525] text-white text-sm rounded-md flex items-center gap-2"
                  >
                    {speciality}
                    <button
                      type="button"
                      onClick={() => removeSpeciality(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm text-gray-400 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Hospital"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
