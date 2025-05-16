const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Car Accident Prevention and Emergency Response System API",
    version: "1.0.0",
    description:
      "This is a REST API for a Car Accident Prevention and Emergency Response System. It provides endpoints for vehicle management, sensor data updates, accident detection, and emergency reporting.",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "https://integrated-project-mf1f.onrender.com",
      description: "Development Server",
    },
  ],
  tags: [
    {
      name: "Vehicles",
      description: "API endpoints for vehicle operations",
    },
    {
      name: "Accidents",
      description: "API endpoints for accident data and emergency response",
    },
    {
      name: "Hospitals",
      description:
        "API endpoints for hospital management and finding nearby emergency facilities",
    },
  ],
  components: {
    schemas: {
      Vehicle: {
        type: "object",
        required: ["vehicleId", "vehicleName", "driverName", "imageUrl"],
        properties: {
          vehicleId: {
            type: "string",
            description: "Unique identifier for the vehicle (format: VEH-XXXX)",
            example: "VEH-1234",
          },
          vehicleName: {
            type: "string",
            description: "Name or model of the vehicle",
            example: "Toyota Camry",
          },
          driverName: {
            type: "string",
            description: "Name of the vehicle driver",
            example: "John Doe",
          },
          imageUrl: {
            type: "string",
            description: "URL to the vehicle's image",
            example: "https://example.com/vehicle-image.jpg",
          },
          sensorData: {
            type: "object",
            properties: {
              acceleration: {
                type: "object",
                properties: {
                  x: { type: "number", example: 0 },
                  y: { type: "number", example: 0 },
                  z: { type: "number", example: 0 },
                },
              },
              gyroscope: {
                type: "object",
                properties: {
                  pitch: { type: "number", example: 0 },
                  roll: { type: "number", example: 0 },
                  yaw: { type: "number", example: 0 },
                },
              },
              gps: {
                type: "object",
                properties: {
                  latitude: { type: "number", example: 0 },
                  longitude: { type: "number", example: 0 },
                  speed: { type: "number", example: 0 },
                },
              },
            },
          },
          hasAccident: {
            type: "boolean",
            description:
              "Indicates whether the vehicle has been in an accident",
            example: false,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Accident: {
        type: "object",
        required: ["vehicleId", "severity"],
        properties: {
          vehicleId: {
            type: "string",
            description: "Vehicle ID associated with the accident",
            example: "VEH-1234",
          },
          sensorData: {
            $ref: "#/components/schemas/Vehicle/properties/sensorData",
          },
          severity: {
            type: "string",
            enum: ["Low", "Medium", "High"],
            description: "Severity level of the accident",
            example: "Medium",
          },
          time: {
            type: "string",
            format: "date-time",
            description: "Time when the accident occurred",
          },
          location: {
            type: "object",
            properties: {
              latitude: { type: "number", example: 37.7749 },
              longitude: { type: "number", example: -122.4194 },
              address: {
                type: "string",
                example: "123 Main St, San Francisco, CA",
              },
            },
          },
          status: {
            type: "string",
            enum: ["Pending", "Notified"],
            description: "Current status of the emergency response",
            example: "Notified",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Hospital: {
        type: "object",
        required: [
          "name",
          "availableBeds",
          "location_name",
          "location",
          "specialities",
          "phoneNumber",
        ],
        properties: {
          _id: {
            type: "string",
            description: "MongoDB unique identifier",
            example: "60d21b4667d0d8992e610c85",
          },
          name: {
            type: "string",
            description: "Name of the hospital",
            example: "Tikur Anbessa Specialized Hospital",
          },
          availableBeds: {
            type: "integer",
            description: "Number of available beds",
            example: 120,
          },
          location_name: {
            type: "string",
            description: "Human-readable location name",
            example: "Addis Ababa, Kirkos Sub-City",
          },
          location: {
            type: "object",
            properties: {
              latitude: {
                type: "number",
                description: "Latitude coordinate",
                example: 9.0222,
              },
              longitude: {
                type: "number",
                description: "Longitude coordinate",
                example: 38.7468,
              },
            },
          },
          specialities: {
            type: "array",
            description: "Medical specialities available at the hospital",
            items: {
              type: "string",
            },
            example: ["Cardiology", "Emergency", "Surgery", "Pediatrics"],
          },
          phoneNumber: {
            type: "string",
            description: "Contact phone number",
            example: "+251111234567",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error message",
          },
          error: {
            type: "string",
            example: "Detailed error information",
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: "The specified resource was not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      BadRequest: {
        description: "The request was invalid",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      InternalServerError: {
        description: "An internal server error occurred",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
