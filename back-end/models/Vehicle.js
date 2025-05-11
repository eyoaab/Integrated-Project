const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^VEH-\d{4}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid vehicle ID. Format should be VEH-XXXX where XXXX is a 4-digit number.`,
      },
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    sensorData: {
      acceleration: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 },
      },
      gyroscope: {
        pitch: { type: Number, default: 0 },
        roll: { type: Number, default: 0 },
        yaw: { type: Number, default: 0 },
      },
      gps: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
        speed: { type: Number, default: 0 },
      },
    },
    hasAccident: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
