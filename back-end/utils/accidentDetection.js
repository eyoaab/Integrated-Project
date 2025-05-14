const faker = require("faker");
const NodeGeocoder = require("node-geocoder");

// Configure node-geocoder
const options = {
  provider: "openstreetmap",
};
const geocoder = NodeGeocoder(options);

/**
 * Detect if an accident occurred based on sensor data thresholds
 * @param {Object} sensorData - The sensor data from the vehicle
 * @returns {Object} - Contains isAccident flag and accident details if detected
 */
const detectAccident = (sensorData) => {
  if (!sensorData) return { isAccident: false };

  // Calculate acceleration magnitude (√(x² + y² + z²))
  const accelMagnitude = Math.sqrt(
    Math.pow(sensorData.acceleration.x, 2) +
      Math.pow(sensorData.acceleration.y, 2) +
      Math.pow(sensorData.acceleration.z, 2)
  );

  // Check for high acceleration magnitude (crash)
  const highAcceleration = accelMagnitude > 8;

  // Check for abrupt stop (speed < 5 km/h with high acceleration)
  const abruptStop = sensorData.gps.speed < 5 && accelMagnitude > 7;

  // Check for unusual rotation (rollover)
  const rollover = Math.abs(sensorData.gyroscope.roll) > 90;

  // Determine if an accident occurred
  const isAccident = highAcceleration || abruptStop || rollover;

  // Determine severity based on thresholds
  let severity = "Low";
  if (accelMagnitude > 12 || Math.abs(sensorData.gyroscope.roll) > 120) {
    severity = "High";
  } else if (accelMagnitude > 9 || Math.abs(sensorData.gyroscope.roll) > 100) {
    severity = "Medium";
  }

  return {
    isAccident,
    severity,
    accidentType: highAcceleration
      ? "Crash"
      : abruptStop
      ? "Abrupt Stop"
      : rollover
      ? "Rollover"
      : null,
  };
};

/**
 * Generate realistic random sensor data
 * @param {boolean} forceAccident - Whether to force accident conditions
 * @returns {Object} - Generated sensor data
 */
const generateSensorData = (forceAccident = false) => {
  // Generate normal sensor data
  const normalData = {
    acceleration: {
      x: faker.datatype.float({ min: -2, max: 2 }),
      y: faker.datatype.float({ min: -2, max: 2 }),
      z: faker.datatype.float({ min: 0, max: 2 }), // Usually positive in upright position
    },
    gyroscope: {
      pitch: faker.datatype.float({ min: -10, max: 10 }),
      roll: faker.datatype.float({ min: -10, max: 10 }),
      yaw: faker.datatype.float({ min: -10, max: 10 }),
    },
    gps: {
      // Ethiopia's latitude range: approximately 3.5°N to 14.9°N
      latitude: faker.datatype.float({
        min: 3.5,
        max: 14.9,
        precision: 0.000001,
      }),
      // Ethiopia's longitude range: approximately 33°E to 48°E
      longitude: faker.datatype.float({
        min: 33.0,
        max: 48.0,
        precision: 0.000001,
      }),
      speed: faker.datatype.float({ min: 0, max: 120 }), // km/h
    },
  };

  // If forcing accident, modify values to trigger detection
  if (forceAccident) {
    const accidentType = faker.random.arrayElement([
      "crash",
      "abruptStop",
      "rollover",
    ]);

    switch (accidentType) {
      case "crash":
        // High acceleration magnitude
        normalData.acceleration.x =
          faker.datatype.float({ min: 8, max: 20 }) *
          (Math.random() > 0.5 ? 1 : -1);
        normalData.acceleration.y =
          faker.datatype.float({ min: 5, max: 15 }) *
          (Math.random() > 0.5 ? 1 : -1);
        normalData.acceleration.z =
          faker.datatype.float({ min: 5, max: 15 }) *
          (Math.random() > 0.5 ? 1 : -1);
        break;
      case "abruptStop":
        // Low speed with high acceleration
        normalData.gps.speed = faker.datatype.float({ min: 0, max: 4 });
        normalData.acceleration.x =
          faker.datatype.float({ min: 7, max: 15 }) *
          (Math.random() > 0.5 ? 1 : -1);
        break;
      case "rollover":
        // Unusual rotation
        normalData.gyroscope.roll =
          faker.datatype.float({ min: 95, max: 180 }) *
          (Math.random() > 0.5 ? 1 : -1);
        break;
    }
  }

  return normalData;
};

/**
 * Get address from GPS coordinates using geocoder
 * @param {number} latitude - GPS latitude
 * @param {number} longitude - GPS longitude
 * @returns {Promise<string>} - Promise resolving to address string
 */
const getAddress = async (latitude, longitude) => {
  try {
    // Set up geocoder options to prefer English or Amharic results
    const geocoderInstance = NodeGeocoder({
      ...options,
      language: "en", // Prefer English results
    });

    const res = await geocoderInstance.reverse({
      lat: latitude,
      lon: longitude,
    });

    if (res && res.length > 0) {
      // Extract address components
      const addressObj = res[0];

      // Create a custom address format for Ethiopia
      let formattedAddress = "";

      // Check if we have building/street details
      if (addressObj.streetName) {
        formattedAddress += addressObj.streetName;
      }

      // Add neighborhood/suburb if available
      if (addressObj.neighbourhood || addressObj.suburb) {
        if (formattedAddress) formattedAddress += ", ";
        formattedAddress += addressObj.neighbourhood || addressObj.suburb;
      }

      // Add city/town
      if (addressObj.city || addressObj.town || addressObj.state) {
        if (formattedAddress) formattedAddress += ", ";
        formattedAddress +=
          addressObj.city || addressObj.town || addressObj.state;
      }

      // Add country
      if (addressObj.country) {
        if (formattedAddress) formattedAddress += ", ";
        formattedAddress += "Ethiopia";
      }

      // If we still don't have a proper address, use a default Ethiopian format
      if (!formattedAddress || formattedAddress === "Ethiopia") {
        // Default to major cities in Ethiopia based on approximate coordinates
        if (
          latitude > 8.9 &&
          latitude < 9.1 &&
          longitude > 38.7 &&
          longitude < 38.8
        ) {
          formattedAddress = "Addis Ababa, Ethiopia";
        } else if (
          latitude > 11.5 &&
          latitude < 11.7 &&
          longitude > 37.3 &&
          longitude < 37.5
        ) {
          formattedAddress = "Bahir Dar, Ethiopia";
        } else if (
          latitude > 9.3 &&
          latitude < 9.5 &&
          longitude > 42.1 &&
          longitude < 42.2
        ) {
          formattedAddress = "Harar, Ethiopia";
        } else if (
          latitude > 11.5 &&
          latitude < 11.7 &&
          longitude > 39.4 &&
          longitude < 39.6
        ) {
          formattedAddress = "Dessie, Ethiopia";
        } else if (
          latitude > 13.4 &&
          latitude < 13.6 &&
          longitude > 39.4 &&
          longitude < 39.6
        ) {
          formattedAddress = "Mekelle, Ethiopia";
        } else if (
          latitude > 7.0 &&
          latitude < 7.1 &&
          longitude > 38.4 &&
          longitude < 38.5
        ) {
          formattedAddress = "Hawassa, Ethiopia";
        } else if (
          latitude > 9.6 &&
          latitude < 9.7 &&
          longitude > 41.8 &&
          longitude < 41.9
        ) {
          formattedAddress = "Dire Dawa, Ethiopia";
        } else if (
          latitude > 7.6 &&
          latitude < 7.7 &&
          longitude > 36.8 &&
          longitude < 36.9
        ) {
          formattedAddress = "Jimma, Ethiopia";
        } else {
          // For other locations, create a generic Ethiopian address
          formattedAddress = `Location in Ethiopia (${latitude.toFixed(
            4
          )}, ${longitude.toFixed(4)})`;
        }
      }

      return formattedAddress;
    }
    return "Address in Ethiopia";
  } catch (error) {
    console.error("Geocoding error:", error);
    // Return a default Ethiopian location if geocoding fails
    return "Unknown location in Ethiopia";
  }
};

/**
 * Simulate sending emergency notification
 * @param {Object} accident - The accident data
 */
const notifyEmergencyServices = (accident) => {
  console.log("\n🚨 EMERGENCY NOTIFICATION SENT 🚨");
  console.log(`Vehicle ID: ${accident.vehicleId}`);
  console.log(`Accident Severity: ${accident.severity}`);
  console.log(`Time: ${accident.time}`);
  console.log(
    `Location: ${accident.location.address || "Address unavailable"}`
  );
  console.log(
    `Coordinates: ${accident.location.latitude}, ${accident.location.longitude}`
  );
  console.log("Emergency services have been notified.\n");
};

module.exports = {
  detectAccident,
  generateSensorData,
  getAddress,
  notifyEmergencyServices,
};
