const Accident = require("../models/Accident");

/**
 * Get all accidents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllAccidents = async (req, res) => {
  try {
    const accidents = await Accident.find().sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: accidents.length,
      data: accidents,
    });
  } catch (error) {
    console.error("Error fetching accidents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch accidents",
      error: error.message,
    });
  }
};

/**
 * Get accidents by vehicle ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAccidentsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const accidents = await Accident.find({ vehicleId }).sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: accidents.length,
      data: accidents,
    });
  } catch (error) {
    console.error("Error fetching vehicle accidents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle accidents",
      error: error.message,
    });
  }
};

/**
 * Update accident status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAccidentStatus = async (req, res) => {
  try {
    const { accidentId } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Notified"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Status must be either "Pending" or "Notified".',
      });
    }

    const accident = await Accident.findById(accidentId);

    if (!accident) {
      return res.status(404).json({
        success: false,
        message: `Accident with ID ${accidentId} not found.`,
      });
    }

    accident.status = status;
    await accident.save();

    console.log(`Accident ${accidentId} status updated to ${status}`);

    return res.status(200).json({
      success: true,
      message: `Accident status updated to ${status}`,
      data: accident,
    });
  } catch (error) {
    console.error("Error updating accident status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update accident status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAccidents,
  getAccidentsByVehicle,
  updateAccidentStatus,
};
