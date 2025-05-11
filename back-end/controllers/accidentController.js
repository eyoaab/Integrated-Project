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

module.exports = {
  getAllAccidents,
  getAccidentsByVehicle,
};
