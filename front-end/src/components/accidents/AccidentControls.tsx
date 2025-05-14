// import { Accident } from "../../types";

interface AccidentControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  severityFilter: "all" | "High" | "Medium" | "Low";
  onSeverityFilterChange: (severity: "all" | "High" | "Medium" | "Low") => void;
}

export const AccidentControls = ({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
}: AccidentControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search accidents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 px-4 py-2 mt-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value as any)}
        >
          <option value="all">All Severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
};
