import * as Dialog from "@radix-ui/react-dialog";
import { MapPin, X } from "lucide-react";
import { type Accident } from "../../types";

interface FullMapDialogProps {
  accident: Accident | null;
  isOpen: boolean;
  onClose: () => void;
  hospitalMarkers: string;
}

export const FullMapDialog = ({
  accident,
  isOpen,
  onClose,
  hospitalMarkers,
}: FullMapDialogProps) => {
  if (!accident) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-4xl h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg z-50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Accident Location Map
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              title="Full Accident Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                accident.location.longitude - 0.05
              },${accident.location.latitude - 0.05},${
                accident.location.longitude + 0.05
              },${accident.location.latitude + 0.05}&layer=mapnik&marker=${
                accident.location.latitude
              },${accident.location.longitude}${hospitalMarkers}`}
            />
          </div>

          <div className="mt-4 p-2 bg-[#252525] rounded text-sm text-gray-300 flex items-center">
            <div className="flex items-center mr-4">
              <MapPin className="w-4 h-4 text-red-500 mr-1" />
              <span>Accident</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 font-bold text-lg mr-1">•</span>
              <span>Hospital</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
