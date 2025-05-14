import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";
import type { Accident } from "../../types";

interface AccidentReportDialogProps {
  accidents: Accident[];
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = "daily" | "weekly" | "monthly" | "all";
type SeverityFilter = "all" | "High" | "Medium" | "Low";

export const AccidentReportDialog = ({
  accidents,
  isOpen,
  onClose,
}: AccidentReportDialogProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const generateReport = () => {
    // Filter accidents based on selected parameters
    const filteredAccidents = accidents.filter((accident) => {
      const matchesSeverity =
        severityFilter === "all" || accident.severity === severityFilter;

      // Apply time range filter
      if (timeRange === "all") {
        return matchesSeverity;
      }

      const accidentDate = new Date(accident.time);
      const currentDate = new Date();

      if (timeRange === "daily") {
        // Same day
        return (
          matchesSeverity &&
          accidentDate.getDate() === currentDate.getDate() &&
          accidentDate.getMonth() === currentDate.getMonth() &&
          accidentDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (timeRange === "weekly") {
        // Last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        return matchesSeverity && accidentDate >= oneWeekAgo;
      } else if (timeRange === "monthly") {
        // Last 30 days
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(currentDate.getDate() - 30);
        return matchesSeverity && accidentDate >= oneMonthAgo;
      }

      return false;
    });

    // Generate PDF report
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Accident Report", 14, 22);

    // Add filters information
    doc.setFontSize(12);
    doc.text(
      `Time Range: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
      14,
      32
    );
    doc.text(`Severity: ${severityFilter}`, 14, 38);
    doc.text(`Total Accidents: ${filteredAccidents.length}`, 14, 44);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50);

    // Create table data
    const tableColumn = ["Time", "Location", "Vehicle ID", "Speed", "Severity"];
    const tableRows = filteredAccidents.map((accident) => [
      new Date(accident.time).toLocaleString(),
      accident.location.address !== "Geocoding error"
        ? accident.location.address
        : `${accident.location.latitude.toFixed(
            6
          )}, ${accident.location.longitude.toFixed(6)}`,
      accident.vehicleId,
      `${accident.sensorData.gps.speed.toFixed(1)} km/h`,
      accident.severity,
    ]);

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Save PDF
    doc.save(
      `accident-report-${timeRange}-${severityFilter.toLowerCase()}.pdf`
    );

    // Close dialog after generating report
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1E1E1E] p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-white mb-4">
            Generate Accident Report
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily (Last 24 hours)</option>
                <option value="weekly">Weekly (Last 7 days)</option>
                <option value="monthly">Monthly (Last 30 days)</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Severity
              </label>
              <select
                value={severityFilter}
                onChange={(e) =>
                  setSeverityFilter(e.target.value as SeverityFilter)
                }
                className="w-full px-3 py-2 bg-[#252525] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-transparent text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={generateReport}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Generate Report
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
