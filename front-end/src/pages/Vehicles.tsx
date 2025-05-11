import { useState, useEffect } from "react";
import type { Vehicle } from "../types";
import { toast, Toaster } from "sonner";
import { VehicleControls } from "../components/vehicles/VehicleControls";
import {
  VehicleGridView,
  VehicleListView,
  getVehicleStatus,
} from "../components/vehicles/VehicleViews";
import {
  GridSkeleton,
  ListSkeleton,
} from "../components/vehicles/VehicleSkeletons";

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

  const handleTriggerAccident = async (vehicleId: string) => {
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
      setLoadingStates((prev) => ({
        ...prev,
        [vehicleId]: { ...prev[vehicleId], trigger: false },
      }));
    }
  };

  const handleUpdateSensor = async (vehicleId: string) => {
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
      setLoadingStates((prev) => ({
        ...prev,
        [vehicleId]: { ...prev[vehicleId], refresh: false },
      }));
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const vehicleStatus = getVehicleStatus(vehicle).toLowerCase();
    return matchesSearch && vehicleStatus === statusFilter;
  });

  if (loading) {
    return (
      <div>
        <VehicleControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
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
      <VehicleControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      {viewMode === "list" ? (
        <VehicleListView
          vehicles={filteredVehicles}
          loadingStates={loadingStates}
          onTriggerAccident={handleTriggerAccident}
          onUpdateSensor={handleUpdateSensor}
        />
      ) : (
        <VehicleGridView
          vehicles={filteredVehicles}
          loadingStates={loadingStates}
          onTriggerAccident={handleTriggerAccident}
          onUpdateSensor={handleUpdateSensor}
        />
      )}
    </div>
  );
};
