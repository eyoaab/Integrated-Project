const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    sensorData: {
      acceleration: {
        x: Number,
        y: Number,
        z: Number,
      },
      gyroscope: {
        pitch: Number,
        roll: Number,
        yaw: Number,
      },
      gps: {
        latitude: Number,
        longitude: Number,
        speed: Number,
      },
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Notified"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
