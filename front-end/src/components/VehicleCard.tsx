interface Vehicle {
  id: string;
  name: string;
  status: "Active" | "Warning" | "Inactive" | "Critical";
  license: string;
  owner: string;
  battery: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Warning":
        return "bg-yellow-500";
      case "Inactive":
        return "bg-gray-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}
          />
          <span className="text-sm">{vehicle.status}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
        <div className="text-gray-400 text-sm">
          <p>License: {vehicle.license}</p>
          <p>Owner: {vehicle.owner}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Battery</span>
            <span className="text-sm">{vehicle.battery}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${vehicle.battery}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600">
            Details
          </button>
          <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600">
            Track
          </button>
        </div>
      </div>
    </div>
  );
};
