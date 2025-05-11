import { useState, useEffect } from "react";
import type { Vehicle } from "../types";
import {
  Loader2,
  MapPin,
  Activity,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-[#1E1E1E] rounded-lg p-6 hover:bg-[#252525] transition-colors animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <div className="h-4 w-16 bg-gray-600 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-600 rounded" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-600" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-600 rounded" />
            <div className="h-4 w-24 bg-gray-600 rounded" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-full bg-gray-600 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-full bg-gray-600 rounded" />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <div className="flex-1 h-8 bg-gray-600 rounded-md" />
          <div className="flex-1 h-8 bg-gray-600 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

const ListSkeleton = () => (
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
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="border-t border-[#2E2E2E] animate-pulse">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <div className="h-4 w-16 bg-gray-600 rounded" />
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-600 rounded" />
                  <div className="h-3 w-24 bg-gray-600 rounded" />
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-20 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-36 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="h-8 w-20 bg-gray-600 rounded-md" />
                <div className="h-8 w-20 bg-gray-600 rounded-md" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const VehiclesPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "warning" | "critical"
  >("all");
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { trigger: boolean; refresh: boolean };
  }>({});

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/vehicles"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setVehicles(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const updateVehicleData = async (vehicleId: string) => {
    try {
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/vehicles"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated vehicle data");
      }
      const data = await response.json();
      // Update only the specific vehicle in the list
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          const updatedVehicle = data.data.find(
            (v: Vehicle) => v.vehicleId === vehicle.vehicleId
          );
          return updatedVehicle || vehicle;
        })
      );
    } catch (err) {
      toast.error("Failed to update vehicle data");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleTriggerAccident = async (vehicleId: string) => {
    // Set loading state for trigger button
    setLoadingStates((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], trigger: true },
    }));

    try {
      const response = await fetch(
        `https://integrated-project-mf1f.onrender.com/api/cause-accident/${vehicleId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Accident triggered successfully");
        await updateVehicleData(vehicleId);
      } else {
        throw new Error("Failed to trigger accident");
      }
    } catch (err) {
      toast.error("Failed to trigger accident");
    } finally {
      // Reset loading state
      setLoadingStates((prev) => ({
        ...prev,
        [vehicleId]: { ...prev[vehicleId], trigger: false },
      }));
    }
  };

  const handleUpdateSensor = async (vehicleId: string) => {
    // Set loading state for refresh button
    setLoadingStates((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], refresh: true },
    }));

    try {
      const response = await fetch(
        `https://integrated-project-mf1f.onrender.com/api/update-sensor/${vehicleId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Sensor data updated successfully");
        await updateVehicleData(vehicleId);
      } else {
        throw new Error("Failed to update sensor data");
      }
    } catch (err) {
      toast.error("Failed to update sensor data");
    } finally {
      // Reset loading state
      setLoadingStates((prev) => ({
        ...prev,
        [vehicleId]: { ...prev[vehicleId], refresh: false },
      }));
    }
  };

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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const vehicleStatus = getVehicleStatus(vehicle).toLowerCase();
    return matchesSearch && vehicleStatus === statusFilter;
  });

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVehicles.map((vehicle) => {
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
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">
                  {vehicle.vehicleName.substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {vehicle.vehicleName}
                </h3>
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
                onClick={() => handleTriggerAccident(vehicle.vehicleId)}
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
                onClick={() => handleUpdateSensor(vehicle.vehicleId)}
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

  const renderListView = () => (
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
          {filteredVehicles.map((vehicle) => {
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
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-sm">
                        {vehicle.vehicleName.substring(0, 2)}
                      </span>
                    </div>
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
                      onClick={() => handleTriggerAccident(vehicle.vehicleId)}
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
                      onClick={() => handleUpdateSensor(vehicle.vehicleId)}
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

  if (loading) {
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
              <div className="w-64 h-10 bg-[#1E1E1E] rounded-lg animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-[#1E1E1E] rounded-lg animate-pulse" />
          </div>
        </div>
        {viewMode === "list" ? <ListSkeleton /> : <GridSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading vehicles</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {viewMode === "list" ? renderListView() : renderGridView()}
    </div>
  );
};
