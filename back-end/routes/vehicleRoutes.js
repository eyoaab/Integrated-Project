const express = require("express");
const router = express.Router();
const {
  createVehicle,
  updateSensorData,
  causeAccident,
  getAllVehicles,
} = require("../controllers/vehicleController");

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     description: Creates a new vehicle with a unique ID in the format VEH-XXXX.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - driverName
 *               - imageUrl
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 description: Unique ID for the vehicle (format VEH-XXXX)
 *                 example: VEH-1234
 *               driverName:
 *                 type: string
 *                 description: Name of the vehicle driver
 *                 example: John Doe
 *               imageUrl:
 *                 type: string
 *                 description: URL to the vehicle's image
 *                 example: https://example.com/vehicle-image.jpg
 *     responses:
 *       201:
 *         description: Vehicle created successfully
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
 *                   example: Vehicle VEH-1234 created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid vehicle ID format or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Vehicle already exists
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
router.post("/vehicles", createVehicle);

/**
 * @swagger
 * /api/update-sensor/{vehicleId}:
 *   post:
 *     summary: Update sensor data for a vehicle
 *     tags: [Vehicles]
 *     description: Updates sensor data for a specified vehicle and checks for accidents. If no sensor data is provided, random data will be generated.
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         description: The ID of the vehicle to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensorData:
 *                 type: object
 *                 properties:
 *                   acceleration:
 *                     type: object
 *                     properties:
 *                       x:
 *                         type: number
 *                         example: 1.2
 *                       y:
 *                         type: number
 *                         example: 0.7
 *                       z:
 *                         type: number
 *                         example: 1.5
 *                   gyroscope:
 *                     type: object
 *                     properties:
 *                       pitch:
 *                         type: number
 *                         example: 5
 *                       roll:
 *                         type: number
 *                         example: 3
 *                       yaw:
 *                         type: number
 *                         example: 1
 *                   gps:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 37.7749
 *                       longitude:
 *                         type: number
 *                         example: -122.4194
 *                       speed:
 *                         type: number
 *                         example: 50
 *     responses:
 *       200:
 *         description: Sensor data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: Sensor data updated. No accidents detected.
 *                     data:
 *                       type: object
 *                       properties:
 *                         vehicle:
 *                           $ref: '#/components/schemas/Vehicle'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: Sensor data updated. ACCIDENT DETECTED for vehicle VEH-1234!
 *                     data:
 *                       type: object
 *                       properties:
 *                         vehicle:
 *                           $ref: '#/components/schemas/Vehicle'
 *                         accident:
 *                           $ref: '#/components/schemas/Accident'
 *                         report:
 *                           $ref: '#/components/schemas/Report'
 *       404:
 *         description: Vehicle not found
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
router.post("/update-sensor/:vehicleId", updateSensorData);

/**
 * @swagger
 * /api/cause-accident/{vehicleId}:
 *   post:
 *     summary: Simulate an accident for a vehicle
 *     tags: [Vehicles]
 *     description: Simulates an accident for a specified vehicle by generating sensor data that triggers accident detection.
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         description: The ID of the vehicle to simulate an accident for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accident simulated successfully
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
 *                   example: Accident simulated for vehicle VEH-1234!
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicle:
 *                       $ref: '#/components/schemas/Vehicle'
 *                     accident:
 *                       $ref: '#/components/schemas/Accident'
 *                     report:
 *                       $ref: '#/components/schemas/Report'
 *       404:
 *         description: Vehicle not found
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
router.post("/cause-accident/:vehicleId", causeAccident);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     description: Returns a list of all registered vehicles.
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
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
 *                   description: Number of vehicles returned
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/vehicles", getAllVehicles);

module.exports = router;
