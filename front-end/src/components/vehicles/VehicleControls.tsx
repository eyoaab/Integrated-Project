interface VehicleControlsProps {
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: "all" | "active" | "warning" | "critical";
  onStatusFilterChange: (
    status: "all" | "active" | "warning" | "critical"
  ) => void;
}

export const VehicleControls = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: VehicleControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === "list"
              ? "bg-[#1E1E1E] text-white"
              : "text-gray-400 hover:bg-[#1E1E1E]"
          }`}
          onClick={() => onViewModeChange("list")}
        >
          List View
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === "grid"
              ? "bg-[#1E1E1E] text-white"
              : "text-gray-400 hover:bg-[#1E1E1E]"
          }`}
          onClick={() => onViewModeChange("grid")}
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>
  );
};
