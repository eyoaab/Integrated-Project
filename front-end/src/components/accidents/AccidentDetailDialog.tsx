import * as Dialog from "@radix-ui/react-dialog";
import {
  MapPin,
  Activity,
  BarChart2,
  Clock,
  Car,
  Hospital,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Accident } from "../../types";

interface AccidentDetailDialogProps {
  accident: Accident | null;
  isOpen: boolean;
  onClose: () => void;
}

interface NearbyHospital {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

// Add CSS for custom scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #2e2e2e;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3e3e3e;
  }
`;

export const AccidentDetailDialog = ({
  accident,
  isOpen,
  onClose,
}: AccidentDetailDialogProps) => {
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitalError, setHospitalError] = useState<string | null>(null);

  // Add the CSS to the document
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (accident && isOpen) {
      fetchNearbyHospitals(
        accident.location.latitude,
        accident.location.longitude
      );
    }
  }, [accident, isOpen]);

  const fetchNearbyHospitals = async (lat: number, lon: number) => {
    setIsLoadingHospitals(true);
    setHospitalError(null);

    try {
      // Using Overpass API to fetch nearby hospitals within 5km radius
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${lat},${lon});
          way["amenity"="hospital"](around:5000,${lat},${lon});
          relation["amenity"="hospital"](around:5000,${lat},${lon});
        );
        out center;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nearby hospitals");
      }

      const data = await response.json();

      // Process hospital data
      const hospitals: NearbyHospital[] = data.elements
        .filter(
          (element: any) => element.tags && element.tags.amenity === "hospital"
        )
        .map((element: any) => {
          // For ways and relations, the center is provided in 'center'
          const elemLat = element.lat || element.center?.lat;
          const elemLon = element.lon || element.center?.lon;

          // Calculate distance (simple Euclidean distance, not perfect but works for demonstration)
          const distance = Math.sqrt(
            Math.pow((elemLat - lat) * 111.32, 2) + // latitude: 1 deg = 111.32 km
              Math.pow(
                (elemLon - lon) * 111.32 * Math.cos(lat * (Math.PI / 180)),
                2
              ) // longitude: 1 deg = 111.32 * cos(lat) km
          );

          return {
            id: element.id.toString(),
            name: element.tags.name || "Unnamed Hospital",
            lat: elemLat,
            lon: elemLon,
            distance: distance, // in km
          };
        })
        .sort((a: NearbyHospital, b: NearbyHospital) => a.distance - b.distance)
        .slice(0, 5); // Get closest 5 hospitals

      setNearbyHospitals(hospitals);
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      setHospitalError("Could not load nearby hospitals");
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  if (!accident) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  };

  // Create map markers for hospitals
  const hospitalMarkers = nearbyHospitals
    .map(
      (hospital) => `&marker=${hospital.lat},${hospital.lon},%E2%80%A2` // dot marker for hospitals
    )
    .join("");

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg flex flex-col">
          <Dialog.Title className="text-xl font-semibold text-white mb-4">
            Accident Details
          </Dialog.Title>

          {/* Scrollable content area with everything inside */}
          <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
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
                <div className="relative">
                  <div className="mt-2 h-48 bg-gray-800 rounded-lg overflow-hidden">
                    <iframe
                      title="Accident Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        accident.location.longitude - 0.02
                      },${accident.location.latitude - 0.02},${
                        accident.location.longitude + 0.02
                      },${
                        accident.location.latitude + 0.02
                      }&layer=mapnik&marker=${accident.location.latitude},${
                        accident.location.longitude
                      }${hospitalMarkers}`}
                    />
                  </div>
                  <div className="mt-2 p-1 bg-[#252525] rounded text-xs text-gray-300 flex items-center">
                    <div className="flex items-center mr-4">
                      <MapPin className="w-3 h-3 text-red-500 mr-1" />
                      <span>Accident</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-500 font-bold text-lg mr-1">
                        •
                      </span>
                      <span>Hospital</span>
                    </div>
                  </div>
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

            {/* Nearby Hospitals Section - Now inside the scrollable area */}
            <div className="space-y-3 pt-2 mt-2">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-blue-500" />
                <h3 className="text-lg font-medium text-white">
                  Nearby Hospitals
                </h3>
              </div>

              {isLoadingHospitals ? (
                <div className="text-gray-400 text-sm">
                  Loading nearby hospitals...
                </div>
              ) : hospitalError ? (
                <div className="text-red-400 text-sm">{hospitalError}</div>
              ) : nearbyHospitals.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No hospitals found within 5km radius
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {nearbyHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className="bg-[#252525] p-3 rounded-lg"
                    >
                      <div className="text-sm text-white font-medium">
                        {hospital.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {hospital.distance.toFixed(2)} km away
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed footer with close button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-800">
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
