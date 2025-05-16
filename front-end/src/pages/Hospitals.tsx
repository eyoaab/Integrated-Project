import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { MapPin, Phone, Plus } from "lucide-react";
import type { Hospital } from "../types";
import { HospitalDetailDialog } from "../components/hospitals/HospitalDetailDialog";
import { HospitalsMapView } from "../components/hospitals/HospitalsMapView";
import { AddHospitalDialog } from "../components/hospitals/AddHospitalDialog";

export const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/hospitals"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }
      const data = await response.json();
      setHospitals(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-72 h-10 bg-[#1E1E1E] rounded-lg" />
          <div className="w-36 h-9 bg-[#1E1E1E] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#1E1E1E] rounded-lg p-6 h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading hospitals</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded ${
                view === "list"
                  ? "bg-[#252525] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-1 rounded ${
                view === "map"
                  ? "bg-[#252525] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Map View
            </button>
          </div>
          <div className="flex items-center gap-4">
            {view === "list" && (
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <button
              onClick={() => setIsAddHospitalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="bg-[#1E1E1E] rounded-lg overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold text-white mb-3 truncate">
                  {hospital.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      hospital.availableBeds > 25
                        ? "bg-green-500/20 text-green-500"
                        : hospital.availableBeds >= 10
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {hospital.availableBeds} beds available
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">
                      {hospital.location_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{hospital.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-400 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialities.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#252525] text-white text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {hospital.specialities.length > 3 && (
                    <span className="px-2 py-1 bg-[#252525] text-white text-xs rounded">
                      +{hospital.specialities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-auto p-4 bg-[#252525] flex justify-end">
                <button
                  onClick={() => setSelectedHospital(hospital)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <HospitalsMapView hospitals={hospitals} />
      )}

      {/* Hospital Detail Dialog */}
      <HospitalDetailDialog
        hospital={selectedHospital}
        isOpen={selectedHospital !== null}
        onClose={() => setSelectedHospital(null)}
      />

      {/* Add Hospital Dialog */}
      <AddHospitalDialog
        isOpen={isAddHospitalOpen}
        onClose={() => setIsAddHospitalOpen(false)}
        onSuccess={fetchHospitals}
      />
    </div>
  );
};
