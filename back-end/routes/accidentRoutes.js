const express = require("express");
const router = express.Router();
const {
  getAllAccidents,
  getAccidentsByVehicle,
  updateAccidentStatus,
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

/**
 * @swagger
 * /api/accidents/{accidentId}:
 *   put:
 *     summary: Update accident status
 *     tags: [Accidents]
 *     description: Updates the status of an accident record
 *     parameters:
 *       - in: path
 *         name: accidentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the accident to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Notified]
 *                 description: New status for the accident
 *                 example: Notified
 *     responses:
 *       200:
 *         description: Accident status updated successfully
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
 *                   example: Accident status updated to Notified
 *                 data:
 *                   $ref: '#/components/schemas/Accident'
 *       400:
 *         description: Invalid status provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Accident not found
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
router.put("/accidents/:accidentId", updateAccidentStatus);

module.exports = router;
