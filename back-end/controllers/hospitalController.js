const Hospital = require("../models/Hospital");
const { getAddress } = require("../utils/accidentDetection");

/**
 * Create a new hospital
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createHospital = async (req, res) => {
  try {
    const {
      name,
      availableBeds,
      location_name,
      latitude,
      longitude,
      specialities,
      phoneNumber,
    } = req.body;

    // Validate required fields
    if (!name || !location_name || !latitude || !longitude || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided: name, location_name, latitude, longitude, and phoneNumber",
      });
    }

    // Validate specialities
    if (
      !specialities ||
      !Array.isArray(specialities) ||
      specialities.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one speciality must be provided",
      });
    }

    // Validate number fields
    if (typeof availableBeds !== "number" || availableBeds < 0) {
      return res.status(400).json({
        success: false,
        message: "Available beds must be a non-negative number",
      });
    }

    // Check if a hospital with the same name and location already exists
    const existingHospital = await Hospital.findOne({
      name,
      "location.latitude": latitude,
      "location.longitude": longitude,
    });

    if (existingHospital) {
      return res.status(409).json({
        success: false,
        message: `Hospital with name ${name} at this location already exists.`,
      });
    }

    // Create new hospital
    const newHospital = new Hospital({
      name,
      availableBeds,
      location_name,
      location: {
        latitude,
        longitude,
      },
      specialities,
      phoneNumber,
    });

    await newHospital.save();
    console.log(
      `Hospital created: ${name} - Location: ${location_name} - Available Beds: ${availableBeds}`
    );

    return res.status(201).json({
      success: true,
      message: `Hospital ${name} created successfully`,
      data: newHospital,
    });
  } catch (error) {
    console.error("Error creating hospital:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create hospital",
      error: error.message,
    });
  }
};

/**
 * Get all hospitals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals",
      error: error.message,
    });
  }
};

/**
 * Get a single hospital by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: `Hospital with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    console.error("Error fetching hospital:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospital",
      error: error.message,
    });
  }
};

/**
 * Update a hospital
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      availableBeds,
      location_name,
      latitude,
      longitude,
      specialities,
      phoneNumber,
    } = req.body;

    // Find hospital to update
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: `Hospital with ID ${id} not found`,
      });
    }

    // Prepare update object
    const updateData = {};

    if (name) updateData.name = name;
    if (availableBeds !== undefined) {
      if (typeof availableBeds !== "number" || availableBeds < 0) {
        return res.status(400).json({
          success: false,
          message: "Available beds must be a non-negative number",
        });
      }
      updateData.availableBeds = availableBeds;
    }
    if (location_name) updateData.location_name = location_name;

    // Update location if either latitude or longitude is provided
    if (latitude !== undefined || longitude !== undefined) {
      updateData.location = {
        latitude:
          latitude !== undefined ? latitude : hospital.location.latitude,
        longitude:
          longitude !== undefined ? longitude : hospital.location.longitude,
      };
    }

    if (specialities) {
      if (!Array.isArray(specialities) || specialities.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one speciality must be provided",
        });
      }
      updateData.specialities = specialities;
    }

    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Update hospital
    const updatedHospital = await Hospital.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log(`Hospital updated: ${updatedHospital.name}`);

    return res.status(200).json({
      success: true,
      message: `Hospital with ID ${id} updated successfully`,
      data: updatedHospital,
    });
  } catch (error) {
    console.error("Error updating hospital:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update hospital",
      error: error.message,
    });
  }
};

/**
 * Delete a hospital
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findByIdAndDelete(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: `Hospital with ID ${id} not found`,
      });
    }

    console.log(`Hospital deleted: ${hospital.name}`);

    return res.status(200).json({
      success: true,
      message: `Hospital with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete hospital",
      error: error.message,
    });
  }
};

/**
 * Find nearest hospitals to a location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findNearestHospitals = async (req, res) => {
  try {
    const { latitude, longitude, limit = 5, speciality } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Convert string parameters to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const resultLimit = parseInt(limit);

    if (isNaN(lat) || isNaN(lon) || isNaN(resultLimit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude, longitude, or limit parameter",
      });
    }

    // Build query
    let query = {};

    // Filter by speciality if provided
    if (speciality) {
      query.specialities = speciality;
    }

    // Find all hospitals that match the query
    const hospitals = await Hospital.find(query);

    // Calculate distance for each hospital
    const hospitalsWithDistance = hospitals.map((hospital) => {
      // Haversine formula to calculate distance between two points on Earth
      const R = 6371; // Radius of the Earth in km
      const dLat = ((lat - hospital.location.latitude) * Math.PI) / 180;
      const dLon = ((lon - hospital.location.longitude) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((hospital.location.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      return {
        ...hospital.toObject(),
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    // Sort by distance and limit results
    const nearestHospitals = hospitalsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, resultLimit);

    return res.status(200).json({
      success: true,
      count: nearestHospitals.length,
      data: nearestHospitals,
    });
  } catch (error) {
    console.error("Error finding nearest hospitals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to find nearest hospitals",
      error: error.message,
    });
  }
};

module.exports = {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  findNearestHospitals,
};
