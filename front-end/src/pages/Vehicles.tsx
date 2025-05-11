import { useState } from "react";
import type { Vehicle } from "../types";

export const VehiclesPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      vehicleId: "VEH-1234",
      vehicleName: "Toyota Camry",
      driverName: "John Doe",
      imageUrl: "https://example.com/vehicle-image.jpg",
      sensorData: {
        acceleration: { x: 0, y: 0, z: 0 },
        gyroscope: { pitch: 0, roll: 0, yaw: 0 },
        gps: { latitude: 0, longitude: 0, speed: 0 },
      },
      hasAccident: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const getVehicleStatus = (vehicle: Vehicle) => {
    if (vehicle.hasAccident) return "Critical";
    if (vehicle.sensorData.gps.speed > 100) return "Warning";
    return "Active";
  };

  const getStatusColor = (status: "Active" | "Warning" | "Critical") => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Warning":
        return "bg-yellow-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              viewMode === "list"
                ? "bg-[#1E1E1E] text-white"
                : "text-gray-400 hover:bg-[#1E1E1E]"
            }`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-[#1E1E1E] text-white"
                : "text-gray-400 hover:bg-[#1E1E1E]"
            }`}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-64 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#252525] text-gray-400 text-sm">
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Driver</th>
              <th className="px-6 py-4 text-left">Speed</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => {
              const status = getVehicleStatus(vehicle);
              return (
                <tr
                  key={vehicle.vehicleId}
                  className="border-t border-[#2E2E2E]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          status
                        )}`}
                      />
                      <span className="text-sm text-white">{status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.vehicleName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white">{vehicle.vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{vehicle.driverName}</td>
                  <td className="px-6 py-4 text-white">
                    {vehicle.sensorData.gps.speed.toFixed(1)} km/h
                  </td>
                  <td className="px-6 py-4 text-white">
                    {`${vehicle.sensorData.gps.latitude.toFixed(
                      6
                    )}, ${vehicle.sensorData.gps.longitude.toFixed(6)}`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 text-white">
                        Details
                      </button>
                      <button
                        className={`px-3 py-1 text-sm rounded-md text-white ${
                          vehicle.hasAccident
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {vehicle.hasAccident ? "Alert" : "Track"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
