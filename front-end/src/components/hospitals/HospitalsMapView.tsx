import { Hospital } from "../../types";
import { useState, useEffect } from "react";
import { HospitalDetailDialog } from "./HospitalDetailDialog";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface HospitalsMapViewProps {
  hospitals: Hospital[];
}

export const HospitalsMapView = ({ hospitals }: HospitalsMapViewProps) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [map, setMap] = useState<L.Map | null>(null);

  // Calculate the center and bounds for the map
  const calculateMapBounds = () => {
    if (hospitals.length === 0) return null;

    let minLat = hospitals[0].location.latitude;
    let maxLat = hospitals[0].location.latitude;
    let minLon = hospitals[0].location.longitude;
    let maxLon = hospitals[0].location.longitude;

    hospitals.forEach((hospital) => {
      minLat = Math.min(minLat, hospital.location.latitude);
      maxLat = Math.max(maxLat, hospital.location.latitude);
      minLon = Math.min(minLon, hospital.location.longitude);
      maxLon = Math.max(maxLon, hospital.location.longitude);
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    return {
      center: [centerLat, centerLon] as L.LatLngTuple,
      bounds: [
        [minLat, minLon],
        [maxLat, maxLon],
      ] as L.LatLngBoundsLiteral,
    };
  };

  useEffect(() => {
    // Clean up existing map instance
    if (map) {
      map.remove();
      setMap(null);
    }

    const bounds = calculateMapBounds();
    if (!bounds || !hospitals.length) return;

    // Wait for the DOM element to be available
    const mapElement = document.getElementById("hospitals-map");
    if (!mapElement) return;

    // Initialize the map
    const mapInstance = L.map("hospitals-map", {
      center: bounds.center,
      zoom: 13,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    // Add markers for all hospitals
    hospitals.forEach((hospital) => {
      const color =
        hospital.availableBeds > 25
          ? "#22c55e" // green
          : hospital.availableBeds >= 10
          ? "#f59e0b" // yellow
          : "#ef4444"; // red

      const markerHtml = `
        <div style="width: 24px; height: 24px; background-color: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; border: 2px solid white;">
          ${hospital.availableBeds}
        </div>
      `;

      const icon = L.divIcon({
        className: "custom-div-icon",
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(
        [
          hospital.location.latitude,
          hospital.location.longitude,
        ] as L.LatLngTuple,
        { icon }
      ).addTo(mapInstance);

      marker.bindPopup(`
        <div style="font-size: 14px; padding: 4px;">
          <strong>${hospital.name}</strong><br/>
          ${hospital.availableBeds} beds available<br/>
          ${hospital.location_name}
        </div>
      `);

      marker.on("click", () => {
        setSelectedHospital(hospital);
      });
    });

    // Fit bounds with padding
    mapInstance.fitBounds(bounds.bounds, { padding: [50, 50] });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [hospitals]); // Only depend on hospitals array

  return (
    <div className="space-y-4">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
        <div id="hospitals-map" className="h-[calc(100vh-16rem)] w-full" />
        <div className="p-4 bg-[#252525] flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {hospitals.length} hospitals on the map
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">•</span>
              <span className="text-sm text-gray-400">&gt;25 beds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">•</span>
              <span className="text-sm text-gray-400">10-25 beds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">•</span>
              <span className="text-sm text-gray-400">&lt;10 beds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital List Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            className="bg-[#1E1E1E] p-4 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-[#252525] transition-colors"
            onClick={() => setSelectedHospital(hospital)}
          >
            <div
              className={`w-3 h-3 rounded-full mt-1.5 ${
                hospital.availableBeds > 25
                  ? "bg-green-500"
                  : hospital.availableBeds >= 10
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <div>
              <h3 className="text-white font-medium">{hospital.name}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {hospital.location_name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-400">
                  {hospital.availableBeds} beds available
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">
                  {hospital.specialities.length} specialties
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Detail Dialog */}
      <HospitalDetailDialog
        hospital={selectedHospital}
        isOpen={selectedHospital !== null}
        onClose={() => setSelectedHospital(null)}
      />
    </div>
  );
};
