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
  // Define specific Ethiopian cities with their coordinates
  const ethiopianCities = [
    { name: "Addis Ababa", lat: 9.0222, lon: 38.7468 },
    { name: "Dire Dawa", lat: 9.5931, lon: 41.8661 },
    { name: "Mekelle", lat: 13.4967, lon: 39.4697 },
    { name: "Gondar", lat: 12.603, lon: 37.4521 },
    { name: "Bahir Dar", lat: 11.5742, lon: 37.3614 },
    { name: "Hawassa", lat: 7.0504, lon: 38.4955 },
    { name: "Jimma", lat: 7.6667, lon: 36.8333 },
    { name: "Adama", lat: 8.541, lon: 39.27 },
    { name: "Harar", lat: 9.3131, lon: 42.115 },
    { name: "Sodo", lat: 6.85, lon: 37.75 },
    { name: "Dessie", lat: 11.1333, lon: 39.6333 },
    { name: "Debre Markos", lat: 10.3333, lon: 37.7167 },
    { name: "Aksum", lat: 14.13, lon: 38.72 },
    { name: "Bishoftu", lat: 8.75, lon: 38.9833 },
    { name: "Arba Minch", lat: 6.0167, lon: 37.55 },
    { name: "Nekemte", lat: 9.0893, lon: 36.54 },
    { name: "Asosa", lat: 10.0671, lon: 34.5229 },
    { name: "Debre Birhan", lat: 9.6792, lon: 39.5321 },
    { name: "Jijiga", lat: 9.35, lon: 42.8 },
    { name: "Ambo", lat: 8.9833, lon: 37.85 },
  ];

  // Select a random Ethiopian city
  const selectedCity =
    ethiopianCities[Math.floor(Math.random() * ethiopianCities.length)];

  // Add a small random offset (±0.01 degrees) to avoid exact city center coordinates each time
  const latOffset = faker.datatype.float({
    min: -0.01,
    max: 0.01,
    precision: 0.000001,
  });
  const lonOffset = faker.datatype.float({
    min: -0.01,
    max: 0.01,
    precision: 0.000001,
  });

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
      // Use the selected Ethiopian city's coordinates with slight offset
      latitude: selectedCity.lat + latOffset,
      longitude: selectedCity.lon + lonOffset,
      speed: faker.datatype.float({ min: 0, max: 120 }), // km/h
    },
  };

  // Store the city name in a custom property for use by getAddress
  normalData.gps.cityName = selectedCity.name;

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
    // Define Ethiopian regions with their Amharic names (in English characters)
    const ethiopianRegions = {
      "Addis Ababa": "Addis Ababa",
      "Dire Dawa": "Dire Dawa",
      Mekelle: "Tigray Region",
      Gondar: "Amhara Region",
      "Bahir Dar": "Amhara Region",
      Hawassa: "Sidama Region",
      Jimma: "Oromia Region",
      Adama: "Oromia Region",
      Harar: "Harari Region",
      Sodo: "Southern Nations, Nationalities, and Peoples' Region",
      Dessie: "Amhara Region",
      "Debre Markos": "Amhara Region",
      Aksum: "Tigray Region",
      Bishoftu: "Oromia Region",
      "Arba Minch": "Southern Nations, Nationalities, and Peoples' Region",
      Nekemte: "Oromia Region",
      Asosa: "Benishangul-Gumuz Region",
      "Debre Birhan": "Amhara Region",
      Jijiga: "Somali Region",
      Ambo: "Oromia Region",
    };

    // Ethiopian street name patterns for realistic addresses
    const ethiopianStreetPatterns = [
      "Bole Road",
      "Churchill Avenue",
      "Menelik II Avenue",
      "Africa Avenue",
      "Ras Mekonnen Street",
      "Haile Selassie Avenue",
      "Ethiopia Street",
      "Unity Road",
      "Meskel Square Road",
      "Ethio-China Street",
      "National Theater Road",
      "Stadium Road",
      "Main Street",
      "Market Road",
      "University Road",
      "Hospital Street",
    ];

    // Find closest city by coordinates
    const ethiopianCities = [
      { name: "Addis Ababa", lat: 9.0222, lon: 38.7468 },
      { name: "Dire Dawa", lat: 9.5931, lon: 41.8661 },
      { name: "Mekelle", lat: 13.4967, lon: 39.4697 },
      { name: "Gondar", lat: 12.603, lon: 37.4521 },
      { name: "Bahir Dar", lat: 11.5742, lon: 37.3614 },
      { name: "Hawassa", lat: 7.0504, lon: 38.4955 },
      { name: "Jimma", lat: 7.6667, lon: 36.8333 },
      { name: "Adama", lat: 8.541, lon: 39.27 },
      { name: "Harar", lat: 9.3131, lon: 42.115 },
      { name: "Sodo", lat: 6.85, lon: 37.75 },
      { name: "Dessie", lat: 11.1333, lon: 39.6333 },
      { name: "Debre Markos", lat: 10.3333, lon: 37.7167 },
      { name: "Aksum", lat: 14.13, lon: 38.72 },
      { name: "Bishoftu", lat: 8.75, lon: 38.9833 },
      { name: "Arba Minch", lat: 6.0167, lon: 37.55 },
      { name: "Nekemte", lat: 9.0893, lon: 36.54 },
      { name: "Asosa", lat: 10.0671, lon: 34.5229 },
      { name: "Debre Birhan", lat: 9.6792, lon: 39.5321 },
      { name: "Jijiga", lat: 9.35, lon: 42.8 },
      { name: "Ambo", lat: 8.9833, lon: 37.85 },
    ];

    // Try to use geocoder first
    const geocoderInstance = NodeGeocoder({
      ...options,
      language: "en", // Prefer English results
    });

    const res = await geocoderInstance.reverse({
      lat: latitude,
      lon: longitude,
    });

    // If geocoding worked and returned Ethiopia, use it
    if (res && res.length > 0 && res[0].country === "Ethiopia") {
      const addressObj = res[0];

      let formattedAddress = "";

      if (addressObj.streetName) {
        formattedAddress += addressObj.streetName;
      }

      if (addressObj.city) {
        if (formattedAddress) formattedAddress += ", ";
        formattedAddress += addressObj.city;
      }

      if (formattedAddress) formattedAddress += ", ";
      formattedAddress += "Ethiopia";

      return formattedAddress;
    }

    // Fallback to creating a realistic Ethiopian address
    // Find closest city
    let closestCity = ethiopianCities[0];
    let minDistance = Number.MAX_VALUE;

    ethiopianCities.forEach((city) => {
      const distance = Math.sqrt(
        Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    // Create realistic address
    const streetName =
      ethiopianStreetPatterns[
        Math.floor(Math.random() * ethiopianStreetPatterns.length)
      ];
    const buildingNumber = Math.floor(Math.random() * 1000) + 1;
    const region = ethiopianRegions[closestCity.name] || "Ethiopia";

    return `${buildingNumber} ${streetName}, ${closestCity.name}, ${region}, Ethiopia`;
  } catch (error) {
    console.error("Geocoding error:", error);
    // Return a default Ethiopian location if geocoding fails
    return "Bole Road, Addis Ababa, Ethiopia";
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
