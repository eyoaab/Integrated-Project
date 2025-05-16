const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    availableBeds: {
      type: Number,
      required: true,
      min: 0,
    },
    location_name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    specialities: {
      type: [String],
      required: true,
      validate: {
        validator: function (specialities) {
          return specialities.length > 0;
        },
        message: "Hospital must have at least one speciality",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
