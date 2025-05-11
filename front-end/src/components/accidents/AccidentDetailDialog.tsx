import * as Dialog from "@radix-ui/react-dialog";
import { MapPin, Activity, BarChart2, Clock, Car } from "lucide-react";
import type { Accident } from "../../types";

interface AccidentDetailDialogProps {
  accident: Accident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccidentDetailDialog = ({
  accident,
  isOpen,
  onClose,
}: AccidentDetailDialogProps) => {
  if (!accident) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-white mb-4">
            Accident Details
          </Dialog.Title>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>Vehicle ID:</span>
                  <span className="text-white">{accident.vehicleId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Time:</span>
                  <span className="text-white">
                    {formatDate(accident.time)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <BarChart2 className="w-4 h-4" />
                  <span>Severity:</span>
                  <span
                    className={`${
                      accident.severity === "High"
                        ? "text-red-500"
                        : accident.severity === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {accident.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Status:</span>
                  <span
                    className={`${
                      accident.status === "Notified"
                        ? "text-red-500"
                        : accident.status === "Dispatched"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {accident.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 mt-1" />
                  <div>
                    <span>Location:</span>
                    <p className="text-white">
                      {accident.location.address !== "Geocoding error"
                        ? accident.location.address
                        : `${accident.location.latitude.toFixed(
                            6
                          )}, ${accident.location.longitude.toFixed(6)}`}
                    </p>
                  </div>
                </div>
                <div className="mt-2 h-48 bg-gray-800 rounded-lg overflow-hidden">
                  <iframe
                    title="Accident Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      accident.location.longitude - 0.01
                    },${accident.location.latitude - 0.01},${
                      accident.location.longitude + 0.01
                    },${
                      accident.location.latitude + 0.01
                    }&layer=mapnik&marker=${accident.location.latitude},${
                      accident.location.longitude
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Sensor Data</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#252525] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Acceleration
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      X:{" "}
                      <span className="text-white">
                        {accident.sensorData.acceleration.x}
                      </span>
                    </p>
                    <p>
                      Y:{" "}
                      <span className="text-white">
                        {accident.sensorData.acceleration.y}
                      </span>
                    </p>
                    <p>
                      Z:{" "}
                      <span className="text-white">
                        {accident.sensorData.acceleration.z}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-[#252525] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Gyroscope
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Pitch:{" "}
                      <span className="text-white">
                        {accident.sensorData.gyroscope.pitch}
                      </span>
                    </p>
                    <p>
                      Roll:{" "}
                      <span className="text-white">
                        {accident.sensorData.gyroscope.roll}
                      </span>
                    </p>
                    <p>
                      Yaw:{" "}
                      <span className="text-white">
                        {accident.sensorData.gyroscope.yaw}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-[#252525] p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    GPS
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Speed:{" "}
                      <span className="text-white">
                        {accident.sensorData.gps.speed.toFixed(2)} km/h
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
