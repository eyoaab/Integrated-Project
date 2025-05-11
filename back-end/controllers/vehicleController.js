const Vehicle = require("../models/Vehicle");
const Accident = require("../models/Accident");
const Report = require("../models/Report");
const {
  detectAccident,
  generateSensorData,
  getAddress,
  notifyEmergencyServices,
} = require("../utils/accidentDetection");

/**
 * Create a new vehicle
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createVehicle = async (req, res) => {
  try {
    const { vehicleId, vehicleName, driverName, imageUrl } = req.body;

    // Validate vehicle ID format
    if (!vehicleId || !/^VEH-\d{4}$/.test(vehicleId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid vehicle ID format. Format should be VEH-XXXX where XXXX is a 4-digit number.",
      });
    }

    // Validate required fields
    if (!vehicleName || !driverName || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Vehicle name, driver name, and image URL are required.",
      });
    }

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ vehicleId });
    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: `Vehicle with ID ${vehicleId} already exists.`,
      });
    }

    // Create new vehicle
    const newVehicle = new Vehicle({
      vehicleId,
      vehicleName,
      driverName,
      imageUrl,
      // sensorData will be initialized with zeros by default as defined in the schema
      hasAccident: false,
    });

    await newVehicle.save();
    console.log(
      `Vehicle created: ${vehicleId} - Name: ${vehicleName} - Driver: ${driverName} - Image URL: ${imageUrl}`
    );

    return res.status(201).json({
      success: true,
      message: `Vehicle ${vehicleId} (${vehicleName}) created successfully`,
      data: newVehicle,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message,
    });
  }
};

/**
 * Update sensor data for a vehicle and check for accidents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSensorData = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Find vehicle by ID
    const vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: `Vehicle with ID ${vehicleId} not found.`,
      });
    }

    // Use provided sensor data or generate if not provided
    const sensorData = req.body.sensorData || generateSensorData();

    // Update vehicle's sensor data
    vehicle.sensorData = sensorData;

    // Check for accidents
    const accidentResult = detectAccident(sensorData);

    // If accident is detected
    if (accidentResult.isAccident) {
      // Update vehicle's accident status
      vehicle.hasAccident = true;

      // Create accident record
      const accident = new Accident({
        vehicleId,
        sensorData,
        severity: accidentResult.severity,
        time: new Date(),
        location: {
          latitude: sensorData.gps.latitude,
          longitude: sensorData.gps.longitude,
        },
      });

      // Get address from coordinates
      let address;
      try {
        address = await getAddress(
          sensorData.gps.latitude,
          sensorData.gps.longitude
        );
      } catch (error) {
        console.error("Error getting address:", error);
        address = "Address not available";
      }

      // Create report record
      const report = new Report({
        vehicleId,
        sensorData,
        severity: accidentResult.severity,
        time: new Date(),
        location: {
          latitude: sensorData.gps.latitude,
          longitude: sensorData.gps.longitude,
          address,
        },
        status: "Pending",
      });

      // Save records
      await accident.save();
      await report.save();

      // Simulate notification to emergency services
      notifyEmergencyServices(report);

      // Update report status to notified
      report.status = "Notified";
      await report.save();

      console.log(
        `Accident detected for vehicle ${vehicleId}. Severity: ${accidentResult.severity}`
      );

      // Save updated vehicle
      await vehicle.save();

      return res.status(200).json({
        success: true,
        message: `Sensor data updated. ACCIDENT DETECTED for vehicle ${vehicleId}!`,
        data: {
          vehicle,
          accident: {
            ...accident.toObject(),
            type: accidentResult.accidentType,
          },
          report,
        },
      });
    }

    // No accident, just save updated vehicle
    await vehicle.save();

    console.log(
      `Sensor data updated for vehicle ${vehicleId}. No accidents detected.`
    );

    return res.status(200).json({
      success: true,
      message: "Sensor data updated. No accidents detected.",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Error updating sensor data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sensor data",
      error: error.message,
    });
  }
};

/**
 * Cause an accident for a vehicle (simulation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const causeAccident = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Find vehicle by ID
    const vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: `Vehicle with ID ${vehicleId} not found.`,
      });
    }

    // Generate sensor data that will trigger an accident
    const sensorData = generateSensorData(true);

    // Update vehicle sensor data
    vehicle.sensorData = sensorData;

    // Accident detection should always return true in this case
    const accidentResult = detectAccident(sensorData);

    // Update vehicle's accident status
    vehicle.hasAccident = true;

    // Create accident record
    const accident = new Accident({
      vehicleId,
      sensorData,
      severity: accidentResult.severity,
      time: new Date(),
      location: {
        latitude: sensorData.gps.latitude,
        longitude: sensorData.gps.longitude,
      },
    });

    // Get address from coordinates
    let address;
    try {
      address = await getAddress(
        sensorData.gps.latitude,
        sensorData.gps.longitude
      );
    } catch (error) {
      console.error("Error getting address:", error);
      address = "Address not available";
    }

    // Create report record
    const report = new Report({
      vehicleId,
      sensorData,
      severity: accidentResult.severity,
      time: new Date(),
      location: {
        latitude: sensorData.gps.latitude,
        longitude: sensorData.gps.longitude,
        address,
      },
      status: "Pending",
    });

    // Save records
    await accident.save();
    await report.save();
    await vehicle.save();

    // Simulate notification to emergency services
    notifyEmergencyServices(report);

    // Update report status to notified
    report.status = "Notified";
    await report.save();

    console.log(
      `Accident simulated for vehicle ${vehicleId}. Severity: ${accidentResult.severity}`
    );

    return res.status(200).json({
      success: true,
      message: `Accident simulated for vehicle ${vehicleId}!`,
      data: {
        vehicle,
        accident: {
          ...accident.toObject(),
          type: accidentResult.accidentType,
        },
        report,
      },
    });
  } catch (error) {
    console.error("Error simulating accident:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to simulate accident",
      error: error.message,
    });
  }
};

/**
 * Get all vehicles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  updateSensorData,
  causeAccident,
  getAllVehicles,
};
