import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";

interface AddVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddVehicleDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: AddVehicleDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleName: "",
    driverName: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/vehicles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }

      toast.success("Vehicle created successfully");
      onSuccess();
      onClose();
      setFormData({
        vehicleId: "",
        vehicleName: "",
        driverName: "",
        imageUrl: "",
      });
    } catch (error) {
      toast.error("Failed to create vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-white mb-4">
            Add New Vehicle
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label.Root className="text-sm text-gray-400" htmlFor="vehicleId">
                Vehicle ID
              </Label.Root>
              <input
                id="vehicleId"
                name="vehicleId"
                type="text"
                required
                value={formData.vehicleId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VEH-1234"
              />
            </div>
            <div className="space-y-2">
              <Label.Root
                className="text-sm text-gray-400"
                htmlFor="vehicleName"
              >
                Vehicle Name
              </Label.Root>
              <input
                id="vehicleName"
                name="vehicleName"
                type="text"
                required
                value={formData.vehicleName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Toyota Camry"
              />
            </div>
            <div className="space-y-2">
              <Label.Root
                className="text-sm text-gray-400"
                htmlFor="driverName"
              >
                Driver Name
              </Label.Root>
              <input
                id="driverName"
                name="driverName"
                type="text"
                required
                value={formData.driverName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label.Root className="text-sm text-gray-400" htmlFor="imageUrl">
                Image URL
              </Label.Root>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/vehicle-image.jpg"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Vehicle"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
