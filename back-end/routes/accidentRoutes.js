const express = require("express");
const router = express.Router();
const {
  getAllAccidents,
  getAccidentsByVehicle,
} = require("../controllers/accidentController");

/**
 * @swagger
 * /api/accidents:
 *   get:
 *     summary: Get all accidents
 *     tags: [Accidents]
 *     description: Returns a list of all recorded accidents in the system, sorted by time (most recent first).
 *     responses:
 *       200:
 *         description: List of accidents retrieved successfully
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
 *                   description: Number of accidents returned
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Accident'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/accidents", getAllAccidents);

/**
 * @swagger
 * /api/accidents/vehicle/{vehicleId}:
 *   get:
 *     summary: Get accidents for a specific vehicle
 *     tags: [Accidents]
 *     description: Returns a list of all recorded accidents for a specific vehicle, sorted by time (most recent first).
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle to get accidents for
 *         example: VEH-1234
 *     responses:
 *       200:
 *         description: List of vehicle accidents retrieved successfully
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
 *                   description: Number of accidents returned
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Accident'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/accidents/vehicle/:vehicleId", getAccidentsByVehicle);

module.exports = router;
