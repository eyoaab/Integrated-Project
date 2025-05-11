interface Accident {
  id: string;
  status: "Pending" | "Dispatched" | "Resolved";
  location: string;
  time: string;
  vehicle: string;
  severity: "Critical" | "Moderate" | "Minor";
}

interface AccidentCardProps {
  accident: Accident;
}

export const AccidentCard = ({ accident }: AccidentCardProps) => {
  const getStatusColor = (status: Accident["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-red-500";
      case "Dispatched":
        return "bg-yellow-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: Accident["severity"]) => {
    switch (severity) {
      case "Critical":
        return "text-red-500";
      case "Moderate":
        return "text-yellow-500";
      case "Minor":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 text-sm rounded-md ${getStatusColor(
              accident.status
            )} bg-opacity-20`}
          >
            {accident.status}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <span>Location:</span>
            <span className="text-white">{accident.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Time:</span>
            <span className="text-white">{accident.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Vehicle:</span>
            <span className="text-white">{accident.vehicle}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Severity:</span>
            <span className={getSeverityColor(accident.severity)}>
              {accident.severity}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {accident.status === "Pending" && (
            <button className="px-3 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded-md hover:bg-opacity-30">
              Dispatch
            </button>
          )}
          {accident.status === "Dispatched" && (
            <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600">
              Track
            </button>
          )}
          <button className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};
