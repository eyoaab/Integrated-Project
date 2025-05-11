const Report = require("../models/Report");

/**
 * Get all reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

/**
 * Get reports by vehicle ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReportsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const reports = await Report.find({ vehicleId }).sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching vehicle reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle reports",
      error: error.message,
    });
  }
};

/**
 * Update report status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Notified"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Status must be either "Pending" or "Notified".',
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report with ID ${reportId} not found.`,
      });
    }

    report.status = status;
    await report.save();

    console.log(`Report ${reportId} status updated to ${status}`);

    return res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      data: report,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update report status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReports,
  getReportsByVehicle,
  updateReportStatus,
};
