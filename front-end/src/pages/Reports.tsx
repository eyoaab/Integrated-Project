import { useState } from "react";
import { FileText, Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Report {
  name: string;
  type: "Summary" | "Analysis" | "Incident" | "Status";
  dateGenerated: string;
  description: string;
}

export const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "charts">("list");
  const [timeFilter, setTimeFilter] = useState("Last Month");

  // Sample data - replace with actual API call
  const reports: Report[] = [
    {
      name: "Monthly Accident Summary",
      type: "Summary",
      dateGenerated: "2023-05-01",
      description: "Overview of all accidents in April 2023",
    },
    {
      name: "Response Time Analysis",
      type: "Analysis",
      dateGenerated: "2023-04-15",
      description: "Detailed analysis of emergency response times",
    },
    {
      name: "Critical Incidents Report",
      type: "Incident",
      dateGenerated: "2023-04-10",
      description: "Report on all critical incidents in Q1 2023",
    },
    {
      name: "Hospital Engagement",
      type: "Summary",
      dateGenerated: "2023-04-01",
      description: "Summary of hospital participation in emergency response",
    },
    {
      name: "Vehicle Status Report",
      type: "Status",
      dateGenerated: "2023-03-28",
      description: "Status report of all vehicles in the network",
    },
  ];

  const stats = {
    totalAccidents: {
      value: 178,
      change: "+15% from last month",
    },
    responseTime: {
      value: 8.5,
      unit: "min",
      change: "-2.1 min from last month",
    },
    criticalIncidents: {
      value: 42,
      change: "+5% from last month",
    },
    hospitalsEngaged: {
      value: 12,
      change: "-2 from last month",
    },
  };

  // Chart data
  const pieChartData = {
    labels: [
      "149.86 7.41%",
      "109.83 5.43%",
      "193.88 9.59%",
      "154.94 7.66%",
      "190.2 9.70%",
      "220.39 10.90%",
      "216.21 10.69%",
      "127.29 6.29%",
      "173.84 8.60%",
      "114.2 5.65%",
    ],
    datasets: [
      {
        data: [7.41, 5.43, 9.59, 7.66, 9.7, 10.9, 10.69, 6.29, 8.6, 5.65],
        backgroundColor: [
          "#4C51BF",
          "#F56565",
          "#48BB78",
          "#4299E1",
          "#F6AD55",
          "#9F7AEA",
          "#38B2AC",
          "#FC8181",
          "#F6E05E",
          "#667EEA",
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Response Time A",
        data: [65, 45, 85, 25, 95, 45],
        borderColor: "#4299E1",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Response Time B",
        data: [35, 75, 25, 95, 35, 85],
        borderColor: "#F56565",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Response Time C",
        data: [85, 25, 95, 35, 65, 45],
        borderColor: "#48BB78",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9CA3AF",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "#1F2937",
        },
        ticks: {
          color: "#9CA3AF",
        },
      },
      x: {
        grid: {
          color: "#1F2937",
        },
        ticks: {
          color: "#9CA3AF",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#9CA3AF",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>Last Week</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white rounded-lg hover:bg-[#252525]">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1E1E1E] rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-2">Total Accidents</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {stats.totalAccidents.value}
            </span>
            <span className="text-xs text-gray-400">
              {stats.totalAccidents.change}
            </span>
          </div>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-2">Response Time</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {stats.responseTime.value}
            </span>
            <span className="text-sm text-white">
              {stats.responseTime.unit}
            </span>
            <span className="text-xs text-gray-400">
              {stats.responseTime.change}
            </span>
          </div>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-2">Critical Incidents</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {stats.criticalIncidents.value}
            </span>
            <span className="text-xs text-gray-400">
              {stats.criticalIncidents.change}
            </span>
          </div>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-2">Hospitals Engaged</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {stats.hospitalsEngaged.value}
            </span>
            <span className="text-xs text-gray-400">
              {stats.hospitalsEngaged.change}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "list"
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Report List
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "charts"
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Charts
          </button>
        </div>
      </div>

      {/* Report List */}
      {activeTab === "list" && (
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Generated</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-800 text-sm hover:bg-[#252525]"
                >
                  <td className="px-6 py-4 text-white">{report.name}</td>
                  <td className="px-6 py-4 text-white">{report.type}</td>
                  <td className="px-6 py-4 text-white">
                    {report.dateGenerated}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {report.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                        View
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts View */}
      {activeTab === "charts" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Accidents by Severity */}
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-1">
              Accidents by Severity
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Distribution of accidents by severity level
            </p>
            <div className="h-[400px]">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Response Time Trends */}
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-1">
              Response Time Trends
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Average response time over the last 6 months
            </p>
            <div className="h-[400px]">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
