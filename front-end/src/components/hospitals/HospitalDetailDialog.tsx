import * as Dialog from "@radix-ui/react-dialog";
import {
  MapPin,
  Phone,
  X,
  Clock,
  Building2,
  Stethoscope,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import type { Hospital } from "../../types";
import { FullMapDialog } from "./FullMapDialog";

interface HospitalDetailDialogProps {
  hospital: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalDetailDialog = ({
  hospital,
  isOpen,
  onClose,
}: HospitalDetailDialogProps) => {
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);

  if (!hospital) return null;

  const getBedStatusColor = (beds: number) => {
    if (beds > 25) return "bg-green-500/20 text-green-500";
    if (beds >= 10) return "bg-yellow-500/20 text-yellow-500";
    return "bg-red-500/20 text-red-500";
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="text-xl font-semibold text-white mb-2">
                {hospital.name}
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 ${getBedStatusColor(
                    hospital.availableBeds
                  )}`}
                >
                  {hospital.availableBeds} beds available
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Hospital Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{hospital.location_name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{hospital.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>Capacity: {hospital.availableBeds} beds</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialities.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#252525] text-white text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Operating Hours
                </h3>
                <div className="bg-[#252525] rounded-lg p-3 space-y-2">
                  <p className="text-gray-400 text-sm">
                    24/7 Emergency Services
                  </p>
                  <p className="text-gray-400 text-sm">
                    Regular Hours: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Location</h3>
                <button
                  onClick={() => setIsFullMapOpen(true)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  <Maximize2 className="w-4 h-4" />
                  Full View
                </button>
              </div>
              <div className="h-[300px] bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                  title="Hospital Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    hospital.location.longitude - 0.01
                  },${hospital.location.latitude - 0.01},${
                    hospital.location.longitude + 0.01
                  },${hospital.location.latitude + 0.01}&layer=mapnik&marker=${
                    hospital.location.latitude
                  },${hospital.location.longitude}`}
                />
              </div>
              <div className="bg-[#252525] rounded-lg p-3">
                <p className="text-gray-400 text-sm">
                  Coordinates: {hospital.location.latitude.toFixed(4)},{" "}
                  {hospital.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Get Directions
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Full Map Dialog */}
      <FullMapDialog
        hospital={hospital}
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
      />
    </Dialog.Root>
  );
};
