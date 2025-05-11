import { useState } from "react";
import type { Accident } from "../types";

export const AccidentsPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [accidents, setAccidents] = useState<Accident[]>([
    {
      _id: "68203726fa2ebfa8dc9795bc",
      vehicleId: "VEH-1234",
      severity: "Medium",
      time: "2025-05-11T05:35:34.936Z",
      status: "Notified",
      sensorData: {
        acceleration: {
          x: -9.55,
          y: 1.37,
          z: 0.33,
        },
        gyroscope: {
          pitch: 8.32,
          roll: 0.72,
          yaw: -5.05,
        },
        gps: {
          latitude: 28.555902,
          longitude: -25.486434,
          speed: 3.97,
        },
      },
      location: {
        latitude: 28.555902,
        longitude: -25.486434,
        address: "Geocoding error",
      },
      createdAt: "2025-05-11T05:35:34.961Z",
      updatedAt: "2025-05-11T05:35:35.361Z",
    },
  ]);

  const getStatusColor = (status: Accident["status"]) => {
    switch (status) {
      case "Notified":
        return "bg-red-500 bg-opacity-20 text-red-500";
      case "Dispatched":
        return "bg-yellow-500 bg-opacity-20 text-yellow-500";
      case "Resolved":
        return "bg-green-500 bg-opacity-20 text-green-500";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-500";
    }
  };

  const getSeverityColor = (severity: Accident["severity"]) => {
    switch (severity) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
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
              viewMode === "map"
                ? "bg-[#1E1E1E] text-white"
                : "text-gray-400 hover:bg-[#1E1E1E]"
            }`}
            onClick={() => setViewMode("map")}
          >
            Map View
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search accidents..."
              className="w-64 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white hover:bg-[#2E2E2E]">
            Last 24h
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#252525] text-gray-400 text-sm">
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">Vehicle ID</th>
              <th className="px-6 py-4 text-left">Speed</th>
              <th className="px-6 py-4 text-left">Severity</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {accidents.map((accident) => (
              <tr key={accident._id} className="border-t border-[#2E2E2E]">
                <td className="px-6 py-4">
                  <div
                    className={`px-3 py-1 text-sm rounded-md inline-block ${getStatusColor(
                      accident.status
                    )}`}
                  >
                    {accident.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-white">
                  {accident.location.address !== "Geocoding error"
                    ? accident.location.address
                    : `${accident.location.latitude.toFixed(
                        6
                      )}, ${accident.location.longitude.toFixed(6)}`}
                </td>
                <td className="px-6 py-4 text-white">
                  {formatDate(accident.time)}
                </td>
                <td className="px-6 py-4 text-white">{accident.vehicleId}</td>
                <td className="px-6 py-4 text-white">
                  {accident.sensorData.gps.speed.toFixed(1)} km/h
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        accident.severity === "High"
                          ? "bg-red-500"
                          : accident.severity === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className={getSeverityColor(accident.severity)}>
                      {accident.severity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {accident.status === "Notified" ? (
                    <button className="px-3 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded-md hover:bg-opacity-30">
                      Dispatch
                    </button>
                  ) : (
                    <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 text-white">
                      {accident.status === "Dispatched" ? "Track" : "Detail"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
