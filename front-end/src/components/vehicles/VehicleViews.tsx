import {
  Loader2,
  MapPin,
  Activity,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import type { Vehicle } from "../../types";
import { useState } from "react";

interface VehicleViewProps {
  vehicles: Vehicle[];
  loadingStates: {
    [key: string]: { trigger: boolean; refresh: boolean };
  };
  onTriggerAccident: (vehicleId: string) => void;
  onUpdateSensor: (vehicleId: string) => void;
}

export const getVehicleStatus = (vehicle: Vehicle) => {
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

const VehicleImage = ({
  vehicle,
  size = "medium",
}: {
  vehicle: Vehicle;
  size?: "small" | "medium" | "large";
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  };

  const fontSizes = {
    small: "text-sm",
    medium: "text-xl",
    large: "text-2xl",
  };

  // Show initials if image URL is empty or if there was an error loading the image
  if (!vehicle.imageUrl || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0`}
      >
        <span className={`text-white ${fontSizes[size]}`}>
          {vehicle.vehicleName.substring(0, 2)}
        </span>
      </div>
    );
  }

  // Show the vehicle image
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden`}
    >
      <img
        src={vehicle.imageUrl}
        alt={vehicle.vehicleName}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export const VehicleGridView = ({
  vehicles,
  loadingStates,
  onTriggerAccident,
  onUpdateSensor,
}: VehicleViewProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {vehicles.map((vehicle) => {
      const status = getVehicleStatus(vehicle);
      const isLoadingTrigger = loadingStates[vehicle.vehicleId]?.trigger;
      const isLoadingRefresh = loadingStates[vehicle.vehicleId]?.refresh;

      return (
        <div
          key={vehicle.vehicleId}
          className="bg-[#1E1E1E] rounded-lg p-6 hover:bg-[#252525] transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  status as "Active" | "Warning" | "Critical"
                )}`}
              />
              <span className="text-sm text-white">{status}</span>
            </div>
            <span className="text-gray-400 text-sm">{vehicle.vehicleId}</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <VehicleImage vehicle={vehicle} size="medium" />
            <div>
              <h3 className="text-white font-medium">{vehicle.vehicleName}</h3>
              <p className="text-gray-400 text-sm">{vehicle.driverName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Speed:</span>
              <span className="text-white text-sm ml-auto">
                {vehicle.sensorData.gps.speed.toFixed(1)} km/h
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Location:</span>
              <span className="text-white text-sm ml-auto">
                {vehicle.sensorData.gps.latitude.toFixed(3)},
                {vehicle.sensorData.gps.longitude.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => onTriggerAccident(vehicle.vehicleId)}
              disabled={isLoadingTrigger || isLoadingRefresh}
              className="flex-1 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingTrigger ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              {isLoadingTrigger ? "Loading..." : "Trigger"}
            </button>
            <button
              onClick={() => onUpdateSensor(vehicle.vehicleId)}
              disabled={isLoadingTrigger || isLoadingRefresh}
              className="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRefresh ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isLoadingRefresh ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

export const VehicleListView = ({
  vehicles,
  loadingStates,
  onTriggerAccident,
  onUpdateSensor,
}: VehicleViewProps) => (
  <div className="bg-[#1E1E1E] rounded-lg">
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
          const isLoadingTrigger = loadingStates[vehicle.vehicleId]?.trigger;
          const isLoadingRefresh = loadingStates[vehicle.vehicleId]?.refresh;

          return (
            <tr
              key={vehicle.vehicleId}
              className="border-t border-[#2E2E2E] hover:bg-[#252525] transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      status as "Active" | "Warning" | "Critical"
                    )}`}
                  />
                  <span className="text-sm text-white">{status}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <VehicleImage vehicle={vehicle} size="small" />
                  <div>
                    <span className="text-white block">
                      {vehicle.vehicleName}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {vehicle.vehicleId}
                    </span>
                  </div>
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
                  <button
                    onClick={() => onTriggerAccident(vehicle.vehicleId)}
                    disabled={isLoadingTrigger || isLoadingRefresh}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingTrigger ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {isLoadingTrigger ? "Loading..." : "Trigger"}
                  </button>
                  <button
                    onClick={() => onUpdateSensor(vehicle.vehicleId)}
                    disabled={isLoadingTrigger || isLoadingRefresh}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingRefresh ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {isLoadingRefresh ? "Loading..." : "Refresh"}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
