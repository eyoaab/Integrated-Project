const express = require("express");
const router = express.Router();
const {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  findNearestHospitals,
} = require("../controllers/hospitalController");

/**
 * @swagger
 * /api/hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     description: Creates a new hospital with specified details and location.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - availableBeds
 *               - location_name
 *               - latitude
 *               - longitude
 *               - specialities
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the hospital
 *                 example: Tikur Anbessa Specialized Hospital
 *               availableBeds:
 *                 type: integer
 *                 description: Number of available beds
 *                 example: 120
 *               location_name:
 *                 type: string
 *                 description: Human-readable location name
 *                 example: Addis Ababa, Kirkos Sub-City
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude coordinate of the hospital
 *                 example: 9.0222
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude coordinate of the hospital
 *                 example: 38.7468
 *               specialities:
 *                 type: array
 *                 description: List of medical specialities available at the hospital
 *                 items:
 *                   type: string
 *                 example: ["Cardiology", "Emergency", "Surgery", "Pediatrics"]
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *                 example: "+251111234567"
 *     responses:
 *       201:
 *         description: Hospital created successfully
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
 *                   example: Hospital Tikur Anbessa Specialized Hospital created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Hospital already exists
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
router.post("/hospitals", createHospital);

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     description: Retrieves a list of all hospitals.
 *     responses:
 *       200:
 *         description: List of hospitals
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
 *                     $ref: '#/components/schemas/Hospital'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/hospitals", getAllHospitals);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   get:
 *     summary: Get a hospital by ID
 *     tags: [Hospitals]
 *     description: Retrieves a specific hospital by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the hospital
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
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
router.get("/hospitals/:id", getHospitalById);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   put:
 *     summary: Update a hospital
 *     tags: [Hospitals]
 *     description: Updates a hospital's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the hospital
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
 *                 description: Name of the hospital
 *               availableBeds:
 *                 type: integer
 *                 description: Number of available beds
 *               location_name:
 *                 type: string
 *                 description: Human-readable location name
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude coordinate of the hospital
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude coordinate of the hospital
 *               specialities:
 *                 type: array
 *                 description: List of medical specialities available at the hospital
 *                 items:
 *                   type: string
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *     responses:
 *       200:
 *         description: Hospital updated successfully
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
 *                   example: Hospital with ID 60d21b4667d0d8992e610c85 updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Hospital not found
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
router.put("/hospitals/:id", updateHospital);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   delete:
 *     summary: Delete a hospital
 *     tags: [Hospitals]
 *     description: Deletes a hospital by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the hospital
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital deleted successfully
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
 *                   example: Hospital with ID 60d21b4667d0d8992e610c85 deleted successfully
 *       404:
 *         description: Hospital not found
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
router.delete("/hospitals/:id", deleteHospital);

/**
 * @swagger
 * /api/nearest-hospitals:
 *   get:
 *     summary: Find nearest hospitals
 *     tags: [Hospitals]
 *     description: Finds hospitals nearest to a specified location, optionally filtered by speciality.
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         description: Latitude coordinate of the location
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: longitude
 *         required: true
 *         description: Longitude coordinate of the location
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of hospitals to return (default is 5)
 *         schema:
 *           type: integer
 *           default: 5
 *       - in: query
 *         name: speciality
 *         required: false
 *         description: Filter hospitals by speciality
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of nearest hospitals
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Hospital'
 *                       - type: object
 *                         properties:
 *                           distance:
 *                             type: number
 *                             description: Distance in kilometers
 *                             example: 2.5
 *       400:
 *         description: Invalid request parameters
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
router.get("/nearest-hospitals", findNearestHospitals);

module.exports = router;
