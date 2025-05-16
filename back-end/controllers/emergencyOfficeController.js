const EmergencyOffice = require("../models/EmergencyOffice");

/**
 * Create a new emergency office
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createEmergencyOffice = async (req, res) => {
  try {
    const { name, role, office_type, email, phone, office_name } = req.body;

    // Validate required fields
    if (!name || !role || !office_type || !email || !phone || !office_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if office with same email exists
    const existingOffice = await EmergencyOffice.findOne({ email });
    if (existingOffice) {
      return res.status(409).json({
        success: false,
        message: "Emergency office with this email already exists",
      });
    }

    // Create new emergency office
    const newOffice = new EmergencyOffice({
      name,
      role,
      office_type,
      email,
      phone,
      office_name,
    });

    await newOffice.save();

    return res.status(201).json({
      success: true,
      message: "Emergency office created successfully",
      data: newOffice,
    });
  } catch (error) {
    console.error("Error creating emergency office:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create emergency office",
      error: error.message,
    });
  }
};

/**
 * Get all emergency offices
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllEmergencyOffices = async (req, res) => {
  try {
    const offices = await EmergencyOffice.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: offices.length,
      data: offices,
    });
  } catch (error) {
    console.error("Error fetching emergency offices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch emergency offices",
      error: error.message,
    });
  }
};

/**
 * Get a single emergency office by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmergencyOfficeById = async (req, res) => {
  try {
    const { id } = req.params;

    const office = await EmergencyOffice.findById(id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: `Emergency office with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: office,
    });
  } catch (error) {
    console.error("Error fetching emergency office:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch emergency office",
      error: error.message,
    });
  }
};

/**
 * Update an emergency office
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEmergencyOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, office_type, email, phone, office_name } = req.body;

    // Find office to update
    const office = await EmergencyOffice.findById(id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: `Emergency office with ID ${id} not found`,
      });
    }

    // Check if email is being updated and if it already exists
    if (email && email !== office.email) {
      const existingOffice = await EmergencyOffice.findOne({ email });
      if (existingOffice) {
        return res.status(409).json({
          success: false,
          message: "Emergency office with this email already exists",
        });
      }
    }

    // Update office
    const updatedOffice = await EmergencyOffice.findByIdAndUpdate(
      id,
      {
        name,
        role,
        office_type,
        email,
        phone,
        office_name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Emergency office updated successfully",
      data: updatedOffice,
    });
  } catch (error) {
    console.error("Error updating emergency office:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update emergency office",
      error: error.message,
    });
  }
};

/**
 * Delete an emergency office
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteEmergencyOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const office = await EmergencyOffice.findByIdAndDelete(id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: `Emergency office with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency office deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting emergency office:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete emergency office",
      error: error.message,
    });
  }
};

module.exports = {
  createEmergencyOffice,
  getAllEmergencyOffices,
  getEmergencyOfficeById,
  updateEmergencyOffice,
  deleteEmergencyOffice,
};
