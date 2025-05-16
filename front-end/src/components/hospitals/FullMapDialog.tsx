import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Hospital } from "../../types";

interface FullMapDialogProps {
  hospital: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FullMapDialog = ({
  hospital,
  isOpen,
  onClose,
}: FullMapDialogProps) => {
  if (!hospital) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-4xl h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg z-50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              {hospital.name} - Location Map
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              title="Full Hospital Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                hospital.location.longitude - 0.05
              },${hospital.location.latitude - 0.05},${
                hospital.location.longitude + 0.05
              },${hospital.location.latitude + 0.05}&layer=mapnik&marker=${
                hospital.location.latitude
              },${hospital.location.longitude}`}
            />
          </div>

          <div className="mt-4 bg-[#252525] rounded-lg p-3">
            <p className="text-gray-400 text-sm">
              Address: {hospital.location_name}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Coordinates: {hospital.location.latitude.toFixed(6)},{" "}
              {hospital.location.longitude.toFixed(6)}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
