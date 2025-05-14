import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import type { Accident } from "../types";
import { AccidentDetailDialog } from "../components/accidents/AccidentDetailDialog";
import { AccidentTableSkeleton } from "../components/accidents/AccidentSkeletons";
import { AccidentControls } from "../components/accidents/AccidentControls";
import { AccidentReportDialog } from "../components/accidents/AccidentReportDialog";
import { FileDown } from "lucide-react";

export const AccidentsPage = () => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<
    "all" | "High" | "Medium" | "Low"
  >("all");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const fetchAccidents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/accidents"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch accidents");
      }
      const data = await response.json();
      setAccidents(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch accidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
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

  const filteredAccidents = accidents.filter((accident) => {
    const matchesSearch = accident.vehicleId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || accident.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <AccidentControls
            searchTerm=""
            onSearchChange={() => {}}
            severityFilter="all"
            onSeverityFilterChange={() => {}}
          />
          <div className="w-36 h-9 bg-[#1E1E1E] rounded-lg animate-pulse" />
        </div>
        <AccidentTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading accidents</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-6">
        <AccidentControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
        />
        <button
          onClick={() => setIsReportDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <FileDown className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#252525] text-gray-400 text-sm">
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">Vehicle ID</th>
              <th className="px-6 py-4 text-left">Speed</th>
              <th className="px-6 py-4 text-left">Severity</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccidents.map((accident) => (
              <tr key={accident._id} className="border-t border-[#2E2E2E]">
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
                  <button
                    onClick={() => setSelectedAccident(accident)}
                    className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 text-white"
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AccidentDetailDialog
        accident={selectedAccident}
        isOpen={selectedAccident !== null}
        onClose={() => setSelectedAccident(null)}
      />

      <AccidentReportDialog
        accidents={accidents}
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      />
    </div>
  );
};
