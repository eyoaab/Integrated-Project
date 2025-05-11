const express = require("express");
const router = express.Router();
const {
  getAllReports,
  getReportsByVehicle,
  updateReportStatus,
} = require("../controllers/reportController");

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all emergency reports
 *     tags: [Reports]
 *     description: Returns a list of all emergency reports in the system, sorted by time (most recent first).
 *     responses:
 *       200:
 *         description: List of reports retrieved successfully
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
 *                   description: Number of reports returned
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/reports", getAllReports);

/**
 * @swagger
 * /api/reports/vehicle/{vehicleId}:
 *   get:
 *     summary: Get reports for a specific vehicle
 *     tags: [Reports]
 *     description: Returns a list of all emergency reports for a specific vehicle, sorted by time (most recent first).
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle to get reports for
 *         example: VEH-1234
 *     responses:
 *       200:
 *         description: List of vehicle reports retrieved successfully
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
 *                   description: Number of reports returned
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/reports/vehicle/:vehicleId", getReportsByVehicle);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   put:
 *     summary: Update the status of a report
 *     tags: [Reports]
 *     description: Updates the status of a specific emergency report (Pending/Notified).
 *     parameters:
 *       - in: path
 *         name: reportId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the report to update
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
 *                 description: New status for the report
 *                 example: Notified
 *     responses:
 *       200:
 *         description: Report status updated successfully
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
 *                   example: Report status updated to Notified
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Report not found
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
router.put("/reports/:reportId", updateReportStatus);

module.exports = router;
