const express = require("express");
const router = express.Router();
const {
  createEmergencyOffice,
  getAllEmergencyOffices,
  getEmergencyOfficeById,
  updateEmergencyOffice,
  deleteEmergencyOffice,
} = require("../controllers/emergencyOfficeController");

/**
 * @swagger
 * /api/emergency-offices:
 *   post:
 *     summary: Create a new emergency office
 *     tags: [Emergency Offices]
 *     description: Creates a new emergency office with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - office_type
 *               - email
 *               - phone
 *               - office_name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the emergency office contact person
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 description: Role of the contact person
 *                 example: Emergency Coordinator
 *               office_type:
 *                 type: string
 *                 description: Type of emergency office
 *                 example: Fire Department
 *               email:
 *                 type: string
 *                 description: Email address of the office
 *                 example: emergency@addisfd.gov.et
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *                 example: "+251911234567"
 *               office_name:
 *                 type: string
 *                 description: Official name of the emergency office
 *                 example: Addis Ababa Fire Department
 *     responses:
 *       201:
 *         description: Emergency office created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyOffice'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Emergency office with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/emergency-offices", createEmergencyOffice);

/**
 * @swagger
 * /api/emergency-offices:
 *   get:
 *     summary: Get all emergency offices
 *     tags: [Emergency Offices]
 *     description: Retrieves a list of all emergency offices.
 *     responses:
 *       200:
 *         description: List of emergency offices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmergencyOffice'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/emergency-offices", getAllEmergencyOffices);

/**
 * @swagger
 * /api/emergency-offices/{id}:
 *   get:
 *     summary: Get an emergency office by ID
 *     tags: [Emergency Offices]
 *     description: Retrieves a specific emergency office by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the emergency office
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency office retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyOffice'
 *       404:
 *         description: Emergency office not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/emergency-offices/:id", getEmergencyOfficeById);

/**
 * @swagger
 * /api/emergency-offices/{id}:
 *   put:
 *     summary: Update an emergency office
 *     tags: [Emergency Offices]
 *     description: Updates an existing emergency office's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the emergency office
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the emergency office contact person
 *               role:
 *                 type: string
 *                 description: Role of the contact person
 *               office_type:
 *                 type: string
 *                 description: Type of emergency office
 *               email:
 *                 type: string
 *                 description: Email address of the office
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               office_name:
 *                 type: string
 *                 description: Official name of the emergency office
 *     responses:
 *       200:
 *         description: Emergency office updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyOffice'
 *       404:
 *         description: Emergency office not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/emergency-offices/:id", updateEmergencyOffice);

/**
 * @swagger
 * /api/emergency-offices/{id}:
 *   delete:
 *     summary: Delete an emergency office
 *     tags: [Emergency Offices]
 *     description: Deletes an emergency office by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the emergency office
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency office deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Emergency office deleted successfully
 *       404:
 *         description: Emergency office not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/emergency-offices/:id", deleteEmergencyOffice);

module.exports = router;
